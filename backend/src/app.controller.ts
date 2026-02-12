import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheckResponse } from './health-check-response.interface';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ type: HealthCheckResponse })
  getHealth(): HealthCheckResponse {
    return this.appService.getHealth();
  }
}
