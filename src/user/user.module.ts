import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpace, WorkSpaceSchema } from '../schemas/workspace.schema';
import { UserWorkSpaceController } from './user-workspace/user-workspace.controller';
import { UserWorkSpaceService } from './user-workspace/user-workSpace.service';

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: WorkSpace.name, schema: WorkSpaceSchema }])],
  providers: [UserService,UserWorkSpaceService],
  controllers: [UserController, UserWorkSpaceController],
  exports: [UserService]
})
export class UserModule {}
