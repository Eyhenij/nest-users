import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { AuthService } from '../auth/auth.service';

jest.mock('./users.service');
jest.mock('../auth/auth.service');
jest.mock('../auth/auth.module');

describe('UsersModule', () => {
	beforeEach(async () => {
		jest.resetAllMocks();
		await Test.createTestingModule({
			providers: [UsersService, AuthService],
			controllers: [UsersController],
			imports: [AuthModule, SequelizeModule]
		}).compile();
	});

	it('should be defined', () => {
		expect(UsersModule).toBeDefined();
	});
});
