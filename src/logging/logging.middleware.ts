import { Injectable, NestMiddleware } from '@nestjs/common';
import { IRequest, IResponse, LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private count = 0;
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

    const originalEnd = res.end;
    const responseChunks: Buffer[] = [];

    res.end = function (chunk?: any, encoding?: any, cb?: any) {
      if (chunk) {
        responseChunks.push(
          Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
        );
      }
      return originalEnd.call(this, chunk, encoding, cb);
    };

    res.on('finish', () => {
      let responseBody: any = null;

      if (responseChunks.length > 0) {
        try {
          const fullBody = Buffer.concat(responseChunks).toString('utf8');

          if (res.getHeader('content-type')?.includes('application/json')) {
            responseBody = JSON.parse(fullBody);
          } else {
            responseBody = fullBody;
          }
        } catch (error) {
          console.log('Error parsing response in logger:', error.message);
        }
      }
      const httpResponse: IResponse = {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        body: responseBody,
      };
      this.loggingService.logResponse(httpResponse);
    });

    next();
  }
}
