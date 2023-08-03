import { Test, TestingModule } from '@nestjs/testing';
import { WebclientService } from './webclient.service';

describe('WebclientService', () => {
  let service: WebclientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebclientService],
    }).compile();

    service = module.get<WebclientService>(WebclientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
