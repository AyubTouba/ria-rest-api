import { Module } from '@nestjs/common';
import { ServerConfigService } from './server-config.service';
import { ServerConfigController } from './server-config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerConfig, ServerConfigSchema } from '../schemas/serverConfig.schema';
import { WorkSpace, WorkSpaceSchema } from '../schemas/workspace.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: ServerConfig.name, schema:ServerConfigSchema },{ name: WorkSpace.name, schema:WorkSpaceSchema }])],
  providers: [ServerConfigService],
  controllers: [ServerConfigController]
})
export class ServerConfigModule {}
