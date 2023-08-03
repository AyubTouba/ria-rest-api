import { SubscribeMessage, WebSocketGateway,WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RiaSocketGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ria')
  handleMessage(client: any, payload: any): void {
    this.server.emit('client', "here : " + payload); // this code is for test
    // here the code to send data & make operations to the Frontend
  }

  afterInit(server: Server) {
    //...
   }
  
   handleDisconnect(client: Socket) {
    //...
   }
  
   handleConnection(client: Socket, ...args: any[]) {
    //...
  } 
}
