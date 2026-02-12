import { Injectable } from '@nestjs/common';
import { HealthCheckResponse } from './health-check-response.interface';

 
const { version } = require('../package.json');

@Injectable()
export class AppService {
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      service: 'yet-another-path-planner-backend',
      version,
      timestamp: new Date().toISOString(),
    };
  }
}
