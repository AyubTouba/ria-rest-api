import { Test, TestingModule } from '@nestjs/testing';
import { LogrequestController } from './logrequest.controller';

describe('LogrequestController', () => {
  let controller: LogrequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogrequestController],
    }).compile();

    controller = module.get<LogrequestController>(LogrequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
