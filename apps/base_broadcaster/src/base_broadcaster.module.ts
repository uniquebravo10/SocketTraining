import { Module } from '@nestjs/common';
import { BaseBroadcasterGateway } from './base_broadcaster.gateway';
import { BaseBroadcasterService } from './base_broadcaster.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BaseBroadcasterGateway, BaseBroadcasterService],
})
export class BaseBroadcasterModule {}
