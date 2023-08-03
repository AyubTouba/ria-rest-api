import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkSpaceController } from './user-workspace.controller';

describe('UserWorkSpaceController', () => {
  let controller: UserWorkSpaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWorkSpaceController],
    }).compile();

    controller = module.get<UserWorkSpaceController>(UserWorkSpaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
