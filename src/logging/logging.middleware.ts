import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest, LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private loggingService: LoggingService) {}

  use(req: any, res: any, next: () => void) {
    const httpRequest: IRequest = {
      method: req.method,
      url: req.originalUrl || req.url,
      query: req.query || {},
      params: req.params || {},
      body: req.body,
    };

    this.loggingService.logRequest(httpRequest);

    next();
  }
}
