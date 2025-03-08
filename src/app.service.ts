import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor() { }

  status() {
    return {
      status: 'online',
    };
  }

}
