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
		jest.resetAllMocks();
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

	it('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			jest.spyOn(userRepository, 'findAll').mockReturnValueOnce([testUser]);
			expect(await usersService.findAll()).toEqual([testUser]);
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(userRepository, 'findAll').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.findAll()).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'findAll').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.findAll()).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('findOneById', () => {
		it('should return one user', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(testUser);
			expect(await usersService.findOneById('1')).toEqual(testUser);
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.findOneById('1')).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.findOneById('1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('findOneByLogin', () => {
		it('should return one user', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(testUser);
			expect(await usersService.findOneByLogin('@test')).toEqual(testUser);
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.findOneByLogin('@test')).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.findOneByLogin('@test')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should return response-message', async () => {
			jest.spyOn(userRepository, 'create').mockReturnValueOnce(testUser);
			expect(await usersService.create(testUser as CreateUserDto))
				.toEqual({ message: 'create user-account:success', success: true });
		});

		it('should throw BadRequestException', async () => {
			jest.spyOn(userRepository, 'create').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.create(testUser as CreateUserDto)).rejects.toThrow(BadRequestException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'create').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.create(testUser as CreateUserDto)).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('updateAll', () => {
		it('should return response-message', async () => {
			jest.spyOn(userRepository, 'truncate').mockReturnValueOnce(true);
			jest.spyOn(userRepository, 'bulkCreate').mockReturnValueOnce([testUser]);
			expect(await usersService.updateAll(([testUser] as unknown) as UpdateAllUsersDto))
				.toEqual({ message: 'update all user-accounts:success', success: true });
		});

		it('should throw BadRequestException', async () => {
			jest.spyOn(userRepository, 'bulkCreate').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.updateAll(([testUser] as unknown) as UpdateAllUsersDto)).rejects.toThrow(BadRequestException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'bulkCreate').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.updateAll(([testUser] as unknown) as UpdateAllUsersDto)).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('updateOne', () => {
		it('should return response-message', async () => {
			jest.spyOn(userRepository, 'update').mockReturnValueOnce(testUser);
			expect(await usersService.updateOne(testUser, '1'))
				.toEqual({ message: 'update user-account:success', success: true });
		});

		it('should throw BadRequestException', async () => {
			jest.spyOn(userRepository, 'update').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.updateOne(testUser, '1')).rejects.toThrow(BadRequestException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'update').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.updateOne(testUser, '1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('remove', () => {
		it('should return response-message', async () => {
			jest.spyOn(userRepository, 'destroy').mockReturnValueOnce(testUser);
			expect(await usersService.remove('1'))
				.toEqual({ message: 'delete user-account:success', success: true });
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(userRepository, 'destroy').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.remove('1')).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(userRepository, 'destroy').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(usersService.remove('1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('checkUserExist', () => {
		it('should return true', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(testUser);
			expect(await usersService.checkUserExist('1')).toBeTruthy();
		});

		it('should return false', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(undefined);
			expect(await usersService.checkUserExist('1')).toBeFalsy();
		});

		it('should return false', async () => {
			jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(null);
			expect(await usersService.checkUserExist('1')).toBeFalsy();
		});
	});
});
