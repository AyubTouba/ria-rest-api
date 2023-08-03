import { Module } from '@nestjs/common';
import { WokrSpaceService } from './workspace.service';
import { WorkspaceController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { WorkSpace, WorkSpaceSchema } from '../schemas/workspace.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports:[UserModule,MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: WorkSpace.name, schema: WorkSpaceSchema }])],
  providers: [WokrSpaceService],
  controllers: [WorkspaceController]
})
export class OrganizationModule {}
