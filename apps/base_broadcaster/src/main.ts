import { NestFactory } from '@nestjs/core';
import { BaseBroadcasterModule } from './base_broadcaster.module';

async function bootstrap() {
  const app = await NestFactory.create(BaseBroadcasterModule);
  await app.listen(3001);
}
bootstrap();
