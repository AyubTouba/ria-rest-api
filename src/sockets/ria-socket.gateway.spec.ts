import { Test, TestingModule } from '@nestjs/testing';
import { RiaSocketGateway } from './ria-socket.gateway';

describe('RiaSocketGateway', () => {
  let gateway: RiaSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiaSocketGateway],
    }).compile();

    gateway = module.get<RiaSocketGateway>(RiaSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
