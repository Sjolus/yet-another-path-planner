import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health check response', () => {
      const result = controller.getHealth();
      expect(result).toEqual({
        status: 'ok',
        service: 'yet-another-path-planner-backend',
        version: expect.any(String),
        timestamp: expect.any(String),
      });
    });

    it('should return a valid ISO timestamp', () => {
      const result = service.getHealth();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
