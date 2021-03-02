import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Post } from '../posts/post.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
	providers: [AuthService],
	controllers: [AuthController],
	imports: [
		SequelizeModule.forFeature([User, Post]),
		JwtModule.register({
			secret: 'JwtSecretPhrase'
		})
	],
	exports: [AuthService]
})
export class AuthModule {}
