import { Container, Singleton } from 'typescript-ioc';

import { MiddlewareService } from '@backend/services/app/middleware.service';
import { routes } from '@frontend/routes';

@Singleton
export abstract class BaseRouter {
  protected middlewareService = Container.get(MiddlewareService);
  
  protected routes = routes;
}
