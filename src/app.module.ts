import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		SequelizeModule.forRoot({
			dialect: 'mysql',
			host: 'localhost',
			port: 3306,
			username: process.env.DATA_BASE_USERNAME,
			password: process.env.DATA_BASE_PASSWORD,
			database: process.env.DATA_BASE,
			autoLoadModels: true,
			synchronize: true
		}),
		UsersModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
