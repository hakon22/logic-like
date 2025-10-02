import { Container, Singleton } from 'typescript-ioc';
import type { Request, Response } from 'express';

import { BaseService } from '@backend/services/app/base.service';
import { IdeaService } from '@backend/services/idea/idea.service';
import { paramsIdSchema } from '@backend/validations/params-id.schema';
import { paginationSchema } from '@backend/validations/pagination.schema';

@Singleton
export class IdeaController extends BaseService {
  private readonly ideaService = Container.get(IdeaService);

  public findMany = async (req: Request, res: Response) => {
    try {
      const query = await paginationSchema.validate(req.query);
      const ipAddress = this.getIpAddress(req);

      const items = await this.ideaService.findMany(query, { ipAddress });

      res.json({ code: 1, ...items });
    } catch (e) {
      this.errorHandler(e, res);
    }
  };

  public vote = async (req: Request, res: Response) => {
    try {
      const params = await paramsIdSchema.validate(req.params);
      const ipAddress = this.getIpAddress(req);

      const idea = await this.ideaService.vote(params, { ipAddress });

      res.json({ code: 1, idea });
    } catch (e) {
      this.errorHandler(e, res, 409);
    }
  };
}
