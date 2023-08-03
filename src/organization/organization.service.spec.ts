import { Test, TestingModule } from '@nestjs/testing';
import { WokrSpaceService } from './workspace.service';

describe('OrganizationService', () => {
  let service: WokrSpaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WokrSpaceService],
    }).compile();

    service = module.get<WokrSpaceService>(WokrSpaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
