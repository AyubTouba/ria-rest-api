import { Test, TestingModule } from '@nestjs/testing';
import { LogrequestService } from './logrequest.service';

describe('LogrequestService', () => {
  let service: LogrequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogrequestService],
    }).compile();

    service = module.get<LogrequestService>(LogrequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
