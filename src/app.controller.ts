import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @ApiOperation({ description: 'health check api', summary: 'health check' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @Get()
  healthCheck(): string {
    return 'News Feed API Server';
  }
}
