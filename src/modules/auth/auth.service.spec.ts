import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { User } from '../users/user.model';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { ResponseMessageDto } from '../../interfaces/response.dtos';
import * as bcrypt from 'bcrypt';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
	let authService: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };
	const responseMessage: ResponseMessageDto = { message: 'test message', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthService, UsersService, JwtService]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		usersService = moduleRef.get<UsersService>(UsersService);
		jwtService = moduleRef.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});

	describe('signIn', () => {
		describe('negative result', () => {
			describe('NotFoundException', () => {
				beforeEach(() => {
					jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(null));
				});

				it('should throw NotFoundException', async () => {
					await expect(authService.signIn(testUser)).rejects.toThrow(NotFoundException);
				});

				it('should not throw any other exception', async () => {
					await expect(authService.signIn(testUser)).rejects.not.toThrow(ForbiddenException);
				});
			});

			describe('ForbiddenException', () => {
				beforeEach(() => {
					jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(testUser as User));
					jest.spyOn(authService, 'comparePasswords').mockReturnValueOnce(Promise.resolve(false));
				});

				it('should throw ForbiddenException', async () => {
					await expect(authService.signIn(testUser)).rejects.toThrow(ForbiddenException);
				});

				it('should not throw any other exception', async () => {
					await expect(authService.signIn(testUser)).rejects.not.toThrow(NotFoundException);
				});
			});
		});

		describe('positive result', () => {
			beforeEach(() => {
				jest.spyOn(authService, 'findLogin').mockReturnValueOnce(
					Promise.resolve(({ dataValues: { login: '@test', password: 'testPassword', role: 'user' } } as unknown) as User)
				);
				jest.spyOn(authService, 'comparePasswords').mockReturnValueOnce(Promise.resolve(true));
				jest.spyOn(jwtService, 'signAsync').mockReturnValueOnce(Promise.resolve('test-token-string'));
			});

			it('should return AuthResponseMessageDto', async () => {
				expect(await authService.signIn(testUser)).toEqual({
					profile: { login: '@test', role: 'user' },
					token: 'Bearer test-token-string'
				});
			});

			it('should call findLogin with login-param', async () => {
				await authService.signIn(testUser);
				expect(authService.findLogin).toBeCalledWith(testUser.login);
			});

			it('should call comparePasswords', async () => {
				await authService.signIn(testUser);
				expect(authService.comparePasswords).toBeCalled();
			});

			it('should call JwtService.signAsync', async () => {
				await authService.signIn(testUser);
				expect(jwtService.signAsync).toBeCalled();
			});
		});
	});

	describe('signUp', () => {
		beforeEach(() => {
			jest.spyOn(usersService, 'create').mockReturnValueOnce(Promise.resolve(responseMessage));
		});

		it('should return response-message', async () => {
			expect(await authService.signUp(testUser as CreateUserDto)).toEqual(responseMessage);
		});

		it('should  call usersService.create with testUser-param', async () => {
			await authService.signUp(testUser as CreateUserDto);
			expect(usersService.create).toBeCalledWith(testUser);
		});
	});

	describe('changePassword', () => {
		beforeEach(() => {
			jest.spyOn(authService, 'verifyToken').mockReturnValueOnce(Promise.resolve(testUser as User));
		});

		it('should call verifyToken with param', async () => {
			await authService.changePassword('test-auth-header', { password: 'testNewPassword' });
			expect(authService.verifyToken).toBeCalledWith('test-auth-header');
		});

		it('should call usersService.updateOne', async () => {
			await authService.changePassword('test-auth-header', { password: 'testNewPassword' });
			expect(usersService.updateOne).toBeCalled();
		});
	});

	describe('findLogin', () => {
		it('should return one user', async () => {
			jest.spyOn(usersService, 'findOneByLogin').mockReturnValueOnce(Promise.resolve(testUser as User));
			expect(await authService.findLogin('@test')).toEqual(testUser);
		});
	});

	describe('comparePasswords', () => {
		const salt = 1;
		const password = bcrypt.hashSync('password', salt);

		it('should return true', async () => {
			expect(await authService.comparePasswords('password', password)).toBeTruthy();
		});

		it('should return false', async () => {
			expect(await authService.comparePasswords('anotherPassword', password)).toBeFalsy();
		});
	});

	describe('verifyToken', () => {
		it('should return testUser', async () => {
			jest.spyOn(jwtService, 'verify').mockReturnValueOnce(Promise.resolve(testUser));
			jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(testUser as User));
			expect(await authService.verifyToken('test-auth-header')).toEqual(testUser);
		});

		describe('negative result', () => {
			it('should be undefined', async () => {
				jest.spyOn(jwtService, 'verify').mockReturnValueOnce(Promise.resolve(null));
				await expect(authService.verifyToken('test-auth-header')).rejects.toThrow(UnauthorizedException);
			});

			describe('UnauthorizedException', () => {
				beforeEach(() => {
					jest.spyOn(jwtService, 'verify').mockReturnValueOnce(Promise.reject(new Error()));
				});

				it('should throw UnauthorizedException', async () => {
					await expect(authService.verifyToken('test-auth-header')).rejects.toThrow(UnauthorizedException);
				});

				it('should not throw any other exception', async () => {
					await expect(authService.verifyToken('test-auth-header')).rejects.not.toThrow(NotFoundException);
				});
			});
		});
	});

	describe('verityUserRole', () => {
		it('should call verityToken', async () => {
			jest.spyOn(authService, 'verifyToken').mockReturnValueOnce(Promise.resolve(testUser as User));
			await authService.verifyUserRole('test');
			expect(authService.verifyToken).toBeCalledWith('test');
		});
	});
});
