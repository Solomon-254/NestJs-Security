import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); //should be applied immediately after creating nest application
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); //exlclude properties
  app.enableCors(); //enable  Cross-origin resource sharing (CORS)
  app.useGlobalPipes(new ValidationPipe()); //apply pipe everywhere
  app.use(csurf()); //has an issue, find the a better way
  await app.listen(3000);
}
bootstrap();
