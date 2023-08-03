import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogRequest, LogRequestSchema } from '../schemas/logRequest.schema';
import { WebClient, WebClientSchema } from '../schemas/webClient.schema';
import { WorkSpace, WorkSpaceSchema } from '../schemas/workspace.schema';
import { LogrequestController } from './logrequest.controller';
import { LogrequestService } from './logrequest.service';
import { VisitController } from './visit/visit.controller';
import { VisitService } from './visit/visit.service';

@Module({
  imports:[MongooseModule.forFeature([{ name: WebClient.name, schema:WebClientSchema },{ name: LogRequest.name, schema:LogRequestSchema },{ name: WorkSpace.name, schema:WorkSpaceSchema }])],
  controllers: [LogrequestController, VisitController],
  providers: [LogrequestService, VisitService]
})
export class LogrequestModule {}
