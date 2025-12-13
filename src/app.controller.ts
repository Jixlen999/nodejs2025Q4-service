import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingService } from './logging/logging.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get('/crash')
  getRoot() {
    console.log('APP WILL CRASH IN 3 SECONDS');

    setTimeout(() => {
      console.error('💥💥💥 EXITING WITH CODE 1 💥💥💥');
      process.exit(1);
    }, 3000);
  }

  @Get('unexpected-500-error')
  testUnknownError() {
    throw new Error('Some unexpected error');
  }

  @Get('test-logging')
  testLogger() {
    // uncaughtException
    setTimeout(() => {
      throw new Error('Timer error');
    }, 1000);

    // unhandledRejection
    Promise.reject(new Error('unhandled rejection'));

    this.loggingService.error('Log error');
    this.loggingService.warn('Log warn');
    this.loggingService.log('Log log');
    this.loggingService.debug('Log debug');
    this.loggingService.verbose('Log verbose');
  }
}
