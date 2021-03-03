import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	const config = new DocumentBuilder()
		.setTitle('Nest-Server')
		.setDescription('Nestjs server for Social Network app')
		.setVersion('1.0')
		.addTag('nestjs')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	await app.listen(process.env.PORT);
}

bootstrap().then(() => console.log('Application is listening on port 3000.'));
