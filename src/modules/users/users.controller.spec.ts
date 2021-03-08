import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.model';
import { ResponseMessageDto } from '../../interfaces/response.dtos';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateAllUsersDto } from './dto/updateAllUsersDto';
import { UpdateUserDto } from './dto/updateUser.dto';

jest.mock('../auth/auth.service');
jest.mock('./users.service');

describe('UsersController', () => {
	let usersController: UsersController;
	let usersService: UsersService;

	const testUser = { name: 'Mary', login: '@mary', email: 'mary@gmail.com' };
	const responseMessage: ResponseMessageDto = { message: 'there is some message from usersService', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef = await Test.createTestingModule({
			providers: [UsersService, AuthService],
			controllers: [UsersController]
		}).compile();

		usersController = moduleRef.get<UsersController>(UsersController);
		usersService = moduleRef.get<UsersService>(UsersService);
	});

	test('should be defined', () => {
		expect(usersController).toBeDefined();
	});

	describe('findAll-method', () => {
		test('should return an array of users', async () => {
			jest.spyOn(usersService, 'findAll').mockImplementation(() => Promise.resolve([testUser] as User[]));
			expect(await usersController.findAll()).toEqual([testUser]);
		});
	});

	describe('findOne-method', () => {
		test('should return one user', async () => {
			jest.spyOn(usersService, 'findOneById').mockImplementation(() => Promise.resolve(testUser as User));
			expect(await usersController.findOne('1')).toEqual(testUser);
		});
	});

	describe('create-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(usersService, 'create').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await usersController.create(testUser as CreateUserDto)).toEqual(responseMessage);
		});
	});

	describe('updateAll-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(usersService, 'updateAll').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await usersController.updateAll((testUser as unknown) as UpdateAllUsersDto)).toEqual(responseMessage);
		});
	});

	describe('updateOne-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(usersService, 'updateOne').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await usersController.updateOne(testUser as UpdateUserDto, '1')).toEqual(responseMessage);
		});
	});

	describe('remove-method', () => {
		test('remove-method should return response-message', async () => {
			jest.spyOn(usersService, 'remove').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await usersController.remove('1')).toEqual(responseMessage);
		});
	});
});
