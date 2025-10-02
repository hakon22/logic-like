import { Singleton } from 'typescript-ioc';
import type { Request, Response, NextFunction } from 'express';

import { ipSchema } from '@backend/validations/ip.schema';

@Singleton
export class MiddlewareService {

  private getClientIp = (req: Request) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor && !Array.isArray(xForwardedFor)) {
      return xForwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress;
  };

  public parseIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = this.getClientIp(req) as string;

    try {
      await ipSchema.validate(ip);

      req.headers.ip = ip;
      return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      res.status(403).json({ message: 'Your IP address could not be determined. Disable your ad blocker and VPN and try again.' });
    }
  };
}
