import { Container, Singleton } from 'typescript-ioc';
import _ from 'lodash';

import { IdeaEntity } from '@backend/db/entities/idea.entity';
import { BaseService } from '@backend/services/app/base.service';
import { VoteService } from '@backend/services/vote/vote.service';
import type { VoteEntity } from '@backend/db/entities/vote.entity';
import type { IdeaQueryInterface } from '@backend/types/idea/idea.query.interface';
import type { IdeaOptionsInterface } from '@backend/types/idea/idea.options.interface';
import type { ParamsIdInterface } from '@backend/types/params.id.interface';

@Singleton
export class IdeaService extends BaseService {

  private readonly voteService = Container.get(VoteService);

  private createQueryBuilder = (query?: IdeaQueryInterface, options?: IdeaOptionsInterface) => {
    const manager = options?.manager || this.databaseService.getManager();

    const builder = manager.createQueryBuilder(IdeaEntity, 'idea')
      .setParameters({
        ipAddress: options?.ipAddress,
      });

    if (options?.onlyIds) {
      builder
        .select('idea.id')
        .distinct(true);

      if (!_.isNil(query?.limit) && !_.isNil(query?.offset)) {
        builder
          .limit(query.limit)
          .offset(query.offset);
      }
    } else {
      builder
        .select([
          '"idea"."id" AS "id"',
          '"idea"."title" AS "title"',
          '"idea"."description" AS "description"',
          'COUNT("votes"."id") AS "votesCount"',
          `CASE
              WHEN EXISTS (
                SELECT 1 FROM "idea"."vote"
                WHERE "deleted" IS NULL
                  AND "ip_address" = :ipAddress
                  AND "idea_id" = "idea"."id"
              )
              THEN true
            ELSE false
          END AS "isVoted"`,
        ]);
    }

    builder
      .leftJoin('idea.votes', 'votes')
      .addSelect('COUNT(votes.id)', 'votesCount')
      .orderBy('"votesCount"', 'DESC')
      .addOrderBy('idea.id', 'ASC')
      .groupBy('idea.id');

    if (query?.withDeleted) {
      builder.withDeleted();
    }
    if (query?.id) {
      builder.andWhere('idea.id = :id', { id: query.id });
    }
    if (options?.includeIds?.length) {
      builder.andWhere('idea.id IN(:...includeIds)', { includeIds: options.includeIds });
    }

    return builder;
  };

  public exist = async (query?: IdeaQueryInterface, options?: IdeaOptionsInterface) => {
    const builder = this.createQueryBuilder(query, options);
    
    return builder.getExists();
  };

  public findOne = async (query: IdeaQueryInterface, options?: IdeaOptionsInterface) => {
    const builder = this.createQueryBuilder(query, options);

    const idea = await builder.getRawOne<IdeaEntity>();

    if (!idea) {
      throw new Error(`Идеи с номером #${query.id} не существует.`);
    }

    idea.votesCount = +idea.votesCount;

    return idea;
  };

  public findMany = async (query?: IdeaQueryInterface, options?: IdeaOptionsInterface) => {
    const manager = options?.manager || this.databaseService.getManager();

    const idsBuilder = this.createQueryBuilder(query, { onlyIds: true, manager });

    const [ids, count] = await idsBuilder.getManyAndCount();

    let items: IdeaEntity[] = [];
      
    if (ids.length) {
      items = await this.createQueryBuilder(query, { ...options, manager, includeIds: ids.map(({ id }) => id) })
        .getRawMany<IdeaEntity>();
    }

    for (const idea of items) {
      idea.votesCount = +idea.votesCount;
    }

    const paginationParams = {
      count,
      limit: query?.limit,
      offset: query?.offset,
    };

    return { items, paginationParams };
  };

  public vote = async (params: ParamsIdInterface, options?: IdeaOptionsInterface) => {
    return this.databaseService.getManager().transaction(async (manager) => {

      await this.exist({ id: params.id }, { manager });

      const voteCount = await this.voteService.getCountByIpAddress(options?.ipAddress, { manager });

      if (voteCount >= 10) {
        throw new Error('С одного IP-адреса можно голосовать только 10 раз');
      }

      const existingVote = await this.voteService.existByIpAddress(options?.ipAddress, { ideaId: params.id, manager });

      if (existingVote) {
        throw new Error('Вы уже проголосовали за эту идею');
      }

      if (options?.ipAddress) {
        await this.voteService.createOne({
          ipAddress: options.ipAddress,
          idea: { id: params.id },
        } as VoteEntity,
        { manager });
      } else {
        this.loggerService.warn('Не удалось определить IP адрес голосующего.');
      }

      return this.findOne(params, options);
    });
  };
}
