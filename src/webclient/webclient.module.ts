import { Module } from '@nestjs/common';
import { WebclientService } from './webclient.service';
import { WebclientController } from './webclient.controller';
import { WebClient, WebClientSchema } from '../schemas/webClient.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpace, WorkSpaceSchema } from '../schemas/workspace.schema';
import { ServerConfig, ServerConfigSchema } from '../schemas/serverConfig.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: WebClient.name, schema:WebClientSchema },{ name: WorkSpace.name, schema:WorkSpaceSchema },{ name: ServerConfig.name, schema:ServerConfigSchema }])],
  providers: [WebclientService],
  controllers: [WebclientController]
})
export class WebclientModule {}
