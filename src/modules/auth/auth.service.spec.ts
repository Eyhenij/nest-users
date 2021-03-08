import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { User } from '../users/user.model';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { ResponseMessageDto } from '../../interfaces/response.dtos';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
	let authService: AuthService;
	let usersService: UsersService;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };
	const responseMessage: ResponseMessageDto = { message: 'test message', success: true };

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [AuthService, UsersService, JwtService]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		usersService = moduleRef.get<UsersService>(UsersService);
	});

	test('should be defined', () => {
		expect(authService).toBeDefined();
	});

	describe('findLogin-method', () => {
		test('should return one user', async () => {
			jest.spyOn(usersService, 'findOneByLogin').mockImplementation(() => Promise.resolve(testUser as User));
			expect(await authService.findLogin('@test')).toEqual(testUser);
		});

		// test('should throw InternalServerErrorException', () => {
		// 	jest.spyOn(usersService, '').mockImplementation(() => Promise.reject(new Error()));
		// 	expect(async () => await authService.signIn(testUser)).rejects.toThrow(InternalServerErrorException);
		// });
		//
		// test('should not throw NotFoundException', () => {
		// 	jest.spyOn(usersService, '').mockImplementation(() => Promise.reject(new Error()));
		// 	expect(async () => await authService.signIn(testUser)).rejects.not.toThrow(NotFoundException);
		// });
	});

	describe('signUp-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(usersService, 'create').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await authService.signUp(testUser as CreateUserDto)).toEqual(responseMessage);
		});
	});

	describe('signIn-method', () => {
		test('should call findLogin-method', async () => {
			await authService.signIn(testUser);
			expect(authService.findLogin(testUser.login)).toBeCalled();
		});
	});
});
