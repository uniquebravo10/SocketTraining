import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TusdtBroadcastResponse } from 'lib/common';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'priceData',
  cors: { origin: '*' },
})
export class BaseBroadcasterGateway {
  @WebSocketServer() server: Server;

  broadcast(event: string, data: TusdtBroadcastResponse) {
    this.server.emit(event, data);
  }
}
