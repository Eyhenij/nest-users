import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { User } from '../users/user.model';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
	let authService: AuthService;
	let usersService: UsersService;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };

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
		test('should return an array of users', async () => {
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
});
