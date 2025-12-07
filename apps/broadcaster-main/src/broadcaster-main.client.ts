import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModifiedData, TusdtBroadcastResponse } from "lib/common";
import { Socket, io } from "socket.io-client";
import { BroadcasterMainService } from "./broadcaster-main.service";


@Injectable()
export class BroadcasterMainClient implements OnModuleInit {

    private socket:Socket;

    constructor(private readonly mainservice:BroadcasterMainService){}

    onModuleInit() {
        console.log('FinalBroadcaster initialized, connecting to EventReceiver...');
         this.socket = io('http://localhost:3002/modified-data',{
            transports: ['websocket'],
        })

         this.socket.on('connect', () => {
      console.log('Connected to EventReceiver');
    });

      this.socket.on('modifiedPrice', (data: ModifiedData) => {

      this.mainservice.broadcastMarkedData(data);
    });

    }


}