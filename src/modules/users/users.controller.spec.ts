import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.model';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { ResponseMessageDto } from '../../interfaces/response.dtos';

jest.mock('./users.service');
jest.mock('../auth/auth.service');

describe('UsersController', () => {
	let mockUsersController: UsersController;
	let mockUsersService: UsersService;

	jest.mock('./user.model');
	jest.mock('../posts/post.model');

	beforeEach(async () => {
		jest.resetAllMocks();

		const mockUsersModule: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [<jest.Mock<UsersService>>UsersService, <jest.Mock<AuthService>>AuthService]
		}).compile();

		mockUsersController = mockUsersModule.get<UsersController>(UsersController);
		mockUsersService = mockUsersModule.get<UsersService>(UsersService);
	});

	test('should be defined', () => {
		expect(mockUsersController).toBeDefined();
	});

	describe('findAll method', () => {
		// const findAll = jest.spyOn(mockUsersService, 'findAll');
		// findAll.mockImplementation(() => new Promise((resolve, reject) => [User]));

		test('should return an array of users', async () => {
			const result: User[] | ResponseMessageDto = await mockUsersController.findAll();
			// expect(findAll).toBeCalled();
			expect(result).toEqual([User]);
		});
	});
});
