import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ModifiedData } from "lib/common";
import { Server } from "socket.io";
@WebSocketGateway({namespace: 'modified-data',
  cors: { origin: '*' },})
export class EventReceiverGateway {

    @WebSocketServer() server :Server;

    broadcastModifiedData(event:string, data:ModifiedData){

        this.server.emit(event, data);
    }

}