
import { Module } from '@nestjs/common';
import { RiaSocketGateway } from './ria-socket.gateway';

@Module({
  providers: [RiaSocketGateway],
})
export class SocketModule {}