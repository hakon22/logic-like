import { Container, Singleton } from 'typescript-ioc';
import type { Router } from 'express';

import { BaseRouter } from '@backend/routes/base.route';
import { IdeaController } from '@backend/controllers/idea/idea.controller';

@Singleton
export class IdeaRoute extends BaseRouter {
  private readonly ideaController = Container.get(IdeaController);

  public set = (router: Router) => {
    router.get(this.routes.idea.findMany, this.middlewareService.parseIpMiddleware, this.ideaController.findMany);
    router.get(this.routes.idea.vote(), this.middlewareService.parseIpMiddleware, this.ideaController.vote);
  };
}
