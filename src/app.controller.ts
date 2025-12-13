import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
