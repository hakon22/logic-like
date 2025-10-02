import { Singleton } from 'typescript-ioc';

import { VoteEntity } from '@backend/db/entities/vote.entity';
import { BaseService } from '@backend/services/app/base.service';
import type { VoteQueryInterface } from '@backend/types/vote/vote.query.interface';
import type { VoteOptionsInterface } from '@backend/types/vote/vote.options.interface';

@Singleton
export class VoteService extends BaseService {

  private createQueryBuilder = (query?: VoteQueryInterface, options?: VoteOptionsInterface) => {
    const manager = options?.manager || this.databaseService.getManager();

    const builder = manager.createQueryBuilder(VoteEntity, 'vote');

    builder
      .select([
        'vote.id',
        'vote.created',
        'vote.deleted',
        'vote.ipAddress',
      ]);

    builder.orderBy('vote.id', 'DESC');

    if (query?.withDeleted) {
      builder.withDeleted();
    }
    if (query?.ipAddress) {
      builder.andWhere('vote.ipAddress = :ipAddress', { ipAddress: query.ipAddress });
    }
    if (options?.ideaId) {
      builder.andWhere('vote.idea = :ideaId', { ideaId: options.ideaId });
    }

    return builder;
  };

  public createOne = async (body: VoteEntity, options?: VoteOptionsInterface) => {
    const manager = options?.manager || this.databaseService.getManager();

    return manager
      .getRepository(VoteEntity)
      .create(body)
      .save();
  };

  
  public existByIpAddress = async (ipAddress?: string, options?: VoteOptionsInterface) => {
    if (!ipAddress) {
      return false;
    }

    const builder = this.createQueryBuilder({ ipAddress }, options);
  
    return builder.getExists();
  };

  public getCountByIpAddress = async (ipAddress?: string, options?: VoteOptionsInterface) => {
    if (!ipAddress) {
      return 0;
    }

    const builder = this.createQueryBuilder({ ipAddress }, options);

    return builder.getCount();
  };
}
