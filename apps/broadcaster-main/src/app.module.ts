import { Module } from '@nestjs/common';
import { BroadcasterMainService } from './broadcaster-main.service';
import { BroadcasterMainClient } from './broadcaster-main.client';
import { BroadcasterMainGateway } from './broadcaster-main.gateway';


@Module({
  imports: [],
  controllers: [],
  providers: [BroadcasterMainService, BroadcasterMainClient, BroadcasterMainGateway],
})
export class AppModule {}
