import { Container } from 'typescript-ioc';
import type { Request, Response } from 'express';

import { DatabaseService } from '@backend/db/database.service';
import { LoggerService } from '@backend/services/app/logger.service';

export abstract class BaseService {
  protected databaseService = Container.get(DatabaseService);

  protected loggerService = Container.get(LoggerService);

  protected getIpAddress = (req: Request) => req.headers?.ip as string;

  protected errorHandler = (e: any, res: Response, statusCode = 500) => {
    this.loggerService.error(e);

    let error = `${e?.name}: ${e?.message}`;

    if (e?.name === 'ValidationError') {
      error = `${e?.name}: "${e?.path}" ${e?.message}`;
    }

    res.status(statusCode).json({ error });
  };
}
