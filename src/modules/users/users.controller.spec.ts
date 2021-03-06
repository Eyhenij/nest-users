import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

jest.mock('../auth/auth.service');

describe('UsersController', () => {
	let usersController: UsersController;

	const testUser = { name: 'Mary', login: '@mary', email: 'mary@gmail.com' };
	const responseMessage = { message: 'there is some message from usersService', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();

		const usersService = {
			findAll: () => [testUser],
			findOne: (id) => testUser,
			create: (createData) => responseMessage,
			updateAll: (updataAllData) => responseMessage,
			updateOne: (updateOneData, id) => responseMessage,
			remove: (id) => responseMessage
		};

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthService, { provide: UsersService, useValue: usersService }],
			controllers: [UsersController]
		}).compile();

		usersController = moduleRef.get<UsersController>(UsersController);
	});

	test('should be defined', () => {
		expect(usersController).toBeDefined();
	});

	describe('findAll method', () => {
		test('should return an array of users', async () => {
			expect(await usersController.findAll()).toEqual([testUser]);
		});
	});
});
