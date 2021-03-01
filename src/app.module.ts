import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [
		SequelizeModule.forRoot({
			dialect: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'password',
			database: 'mydb',
			models: [],
			autoLoadModels: true,
			synchronize: true
		}),
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
