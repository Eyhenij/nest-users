import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
	providers: [AuthService, UsersService],
	controllers: [AuthController],
	imports: [
		SequelizeModule.forFeature([User]),
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: process.env.JWT_SECRET_PHRASE
			})
		})
	],
	exports: [AuthService]
})
export class AuthModule {}
