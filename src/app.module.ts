import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServerConfigModule } from './server-config/server-config.module';
import { WebclientModule } from './webclient/webclient.module';
import { LogrequestModule } from './logrequest/logrequest.module';
import { RiaSocketGateway } from './sockets/ria-socket.gateway';
import { SocketModule } from './sockets/socket.module';
import { OrganizationModule } from './organization/organization.module';
require('dotenv').config()

const ENV = process.env.NODE_ENV;
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ENV != 'development' ?  `${ENV}.env` : `.env`}),
  MongooseModule.forRoot(process.env.MONGO_SERVER+"/"+process.env.MONGO_DATABASE), AuthModule, UserModule,ServerConfigModule, WebclientModule, LogrequestModule,SocketModule, OrganizationModule],
  controllers: [],
  providers: [RiaSocketGateway],
})
export class AppModule {}
