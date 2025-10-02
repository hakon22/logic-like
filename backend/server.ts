import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import 'dotenv/config';
import 'reflect-metadata';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { Container } from 'typescript-ioc';

import { RouterService } from '@backend/services/app/router.service';
import { BaseService } from '@backend/services/app/base.service';

const { port = 3001 } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Server extends BaseService {
  private readonly routerService = Container.get(RouterService);

  private buildPath = process.env.DB === 'LOCAL'
    ? join(__dirname, '..', 'frontend', 'public')
    : join(__dirname, '..', 'frontend');

  private app = express();

  private init = async () => {
    await this.databaseService.init();
  };

  public start = async () => {
    await this.init();

    this.routerService.set();

    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.routerService.get());

    this.app.get('/*', (req: Request, res: Response) => res.sendFile(join(this.buildPath, 'index.html')));

    this.app.listen(port, () => console.log(`Server is online on port: ${port}`));
  };
}

const server = new Server();

server.start();
