import { Singleton, Container } from 'typescript-ioc';
import express from 'express';

import { BaseRouter } from '@backend/routes/base.route';
import { IdeaRoute } from '@backend/routes/idea/idea.route';

@Singleton
export class RouterService extends BaseRouter {
  private readonly ideaRoute = Container.get(IdeaRoute);

  private router = express.Router();

  private routesArray = [
    this.ideaRoute,
  ];

  public set = () => this.routesArray.forEach((route) => route.set(this.router));

  public get = () => this.router;
}
