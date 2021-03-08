import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/createUser.dto';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateAllUsersDto } from './dto/updateAllUsersDto';

describe('UsersService', () => {
	let usersService: UsersService;
	let userRepository;

	const testUser = { name: 'Mary', login: '@mary', email: 'mary@gmail.com' };
	const mockUserRepo = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		truncate: jest.fn(),
		bulkCreate: jest.fn(),
		update: jest.fn(),
		destroy: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getModelToken(User),
					useValue: mockUserRepo
				}
			]
		}).compile();

		usersService = moduleRef.get<UsersService>(UsersService);
		userRepository = moduleRef.get<User>(getModelToken(User));
	});

	test('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('findAll-method', () => {
		test('should return an array of users', async () => {
			jest.spyOn(userRepository, 'findAll').mockReturnValue([testUser]);
			expect(await usersService.findAll()).toEqual([testUser]);
		});

		test('should throw InternalServerErrorException', () => {
			jest.spyOn(userRepository, 'findAll').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.findAll())
				.rejects
				.toThrow(InternalServerErrorException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'findAll').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.findAll())
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('findOneById-method', () => {
		test('should return one user', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValue(testUser);
			expect(await usersService.findOneById('1')).toEqual(testUser);
		});

		test('should throw InternalServerErrorException', () => {
			jest.spyOn(userRepository, 'findOne').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.findOneById('1'))
				.rejects
				.toThrow(InternalServerErrorException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'findOne').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.findOneById('1'))
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('findOneByLogin-method', () => {
		test('should return one user', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValue(testUser);
			expect(await usersService.findOneByLogin('@test')).toEqual(testUser);
		});

		test('should throw InternalServerErrorException', () => {
			jest.spyOn(userRepository, 'findOne').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.findOneByLogin('@test'))
				.rejects
				.toThrow(InternalServerErrorException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'findOne').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.findOneByLogin('@test'))
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('create-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(userRepository, 'create').mockReturnValue(testUser);
			expect(await usersService.create(testUser as CreateUserDto))
				.toEqual({ message: 'create user-account:success', success: true });
		});

		test('should throw BadRequestException', () => {
			jest.spyOn(userRepository, 'create').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.create(testUser as CreateUserDto))
				.rejects
				.toThrow(BadRequestException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'create').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.create(testUser as CreateUserDto))
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('updateAll-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(userRepository, 'truncate').mockReturnValue(true);
			jest.spyOn(userRepository, 'bulkCreate').mockReturnValue([testUser]);
			expect(await usersService.updateAll(([testUser] as unknown) as UpdateAllUsersDto))
				.toEqual({ message: 'update all user-accounts:success', success: true });
		});

		test('should throw BadRequestException', () => {
			jest.spyOn(userRepository, 'bulkCreate').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.updateAll(([testUser] as unknown) as UpdateAllUsersDto))
				.rejects
				.toThrow(BadRequestException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'bulkCreate').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.updateAll(([testUser] as unknown) as UpdateAllUsersDto))
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('updateOne-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(userRepository, 'update').mockReturnValue(testUser);
			expect(await usersService.updateOne(testUser, '1'))
				.toEqual({ message: 'update user-account:success', success: true });
		});

		test('should throw BadRequestException', () => {
			jest.spyOn(userRepository, 'update').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.updateOne(testUser, '1'))
				.rejects
				.toThrow(BadRequestException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'update').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.updateOne(testUser, '1'))
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('remove-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(userRepository, 'destroy').mockReturnValue(testUser);
			expect(await usersService.remove('1'))
				.toEqual({ message: 'delete user-account:success', success: true });
		});

		test('should throw InternalServerErrorException', () => {
			jest.spyOn(userRepository, 'destroy').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.remove('1'))
				.rejects
				.toThrow(InternalServerErrorException);
		});

		test('should not throw NotFoundException', () => {
			jest.spyOn(userRepository, 'destroy').mockImplementation(() => Promise.reject(new Error()));
			expect(async () => await usersService.remove('1'))
				.rejects
				.not
				.toThrow(NotFoundException);
		});
	});

	describe('checkUserExist-method', () => {
		test('should return true', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValue(testUser);
			expect(await usersService.checkUserExist('1')).toBeTruthy();
		});

		test('should return false', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);
			expect(await usersService.checkUserExist('1')).toBeFalsy();
		});

		test('should return false', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValue(null);
			expect(await usersService.checkUserExist('1')).toBeFalsy();
		});
	});
});
