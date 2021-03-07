import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.model';
import { ResponseMessageDto } from '../../interfaces/response.dtos';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateAllUsersDto } from './dto/updateAllUsersDto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { getModelName, Model, Sequelize } from 'sequelize-typescript';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { Post } from '../posts/post.model';
import { AuthModule } from '../auth/auth.module';

jest.mock('./user.model');
// jest.mock('@nestjs/sequelize');
// jest.mock('sequelize-typescript');

describe('UsersService', () => {
	let usersService: UsersService;
	let data: Sequelize;

	const mockUserRepository = { findAll: jest.fn(() => Promise.resolve([testUser])) };
	const testUser = { name: 'Mary', login: '@mary', email: 'mary@gmail.com' };
	const responseMessage: ResponseMessageDto = { message: 'there is some message from usersService', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef = await Test.createTestingModule({
			providers: [UsersService, Sequelize, { provide: getModelToken(User), useValue: mockUserRepository }]
		}).compile();

		usersService = moduleRef.get<UsersService>(UsersService);
	});

	test('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	// test('findAll-method should return an array of users', async () => {
	// 	// jest.spyOn(data, 'findAll').mockImplementation(() => Promise.resolve([testUser] as User[]));
	// 	expect(await usersService.findAll()).toEqual([testUser]);
	// });
});
