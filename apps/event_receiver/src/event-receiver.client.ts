import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModifiedData, TusdtBroadcastResponse } from "lib/common";
import { Socket, io } from "socket.io-client";
import { EventReceiverService } from "./event_receiver.service";

@Injectable()
export class EventReceiverClient implements OnModuleInit {

    private socket:Socket;

    constructor(private readonly receiverService:EventReceiverService){}

    onModuleInit() {
        console.log('MiddleReceiverClient initialized, connecting to BaseBroadcaster...');
         this.socket = io('http://localhost:3001/priceData',{
            transports: ['websocket'],
        })

         this.socket.on('connect', () => {
      console.log('Connected to BaseBroadcaster');
    });

      this.socket.on('basedata', (data: TusdtBroadcastResponse) => {
      this.receiverService.broadcastMarkedData(data);
    });

    }


}