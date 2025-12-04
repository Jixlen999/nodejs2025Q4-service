import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello() {
    console.log('hello1');
  }
}
