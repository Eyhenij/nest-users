import { AuthModule } from './auth.module';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

jest.mock('../users/users.service');
jest.mock('./auth.service');
jest.mock('@nestjs/jwt');

describe('AuthModule', () => {
	beforeEach(async () => {
		jest.resetAllMocks();
		await Test.createTestingModule({
			providers: [AuthService, UsersService],
			controllers: [AuthController],
			imports: [JwtModule, SequelizeModule]
		}).compile();
	});

	it('should be defined', () => {
		expect(AuthModule).toBeDefined();
	});
});
