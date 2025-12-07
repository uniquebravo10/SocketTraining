import { NestFactory } from '@nestjs/core';
import { EventReceiverModule } from './event_receiver.module';

async function bootstrap() {
  const app = await NestFactory.create(EventReceiverModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
