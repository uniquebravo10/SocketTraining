import { Module } from '@nestjs/common';
import { EventReceiverClient } from './event-receiver.client';
import { EventReceiverGateway } from './event-receiver.gateway';
import { EventReceiverService } from './event_receiver.service';


@Module({
  imports: [],
  controllers: [],
  providers: [EventReceiverClient, EventReceiverGateway, EventReceiverService],
})
export class EventReceiverModule {}
