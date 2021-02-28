import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './database/models/post.model';
import { User } from './database/models/user.model';
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
			define: {
				timestamps: false,
				freezeTableName: true
			},
			models: [User, Post],
			// autoLoadModels: true,
			synchronize: true
		}),
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
