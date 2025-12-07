import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ModifiedData } from "lib/common";
import { Server } from "socket.io";
@WebSocketGateway({namespace: 'final-data',
  cors: { origin: '*' },})
export class BroadcasterMainGateway  {

    @WebSocketServer() server :Server;

    broadcastModifiedData(event:string, data:ModifiedData){

        this.server.emit(event, data);
    }

}