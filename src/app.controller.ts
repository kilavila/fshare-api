import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Server status')
@Controller()
export class AppController {

  constructor(private appService: AppService) { }

  @Get('status')
  @ApiResponse({
    status: 200,
    description: 'Default response',
    example: {
      'status': 'online'
    },
  })
  status() {
    return this.appService.status();
  }

}
