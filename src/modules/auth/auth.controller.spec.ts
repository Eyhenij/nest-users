import { Test } from '@nestjs/testing';
import { AuthResponseMessageDto, ResponseMessageDto } from '../../interfaces/response.dtos';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { IncomingHttpHeaders } from 'http';

jest.mock('./auth.service');

describe('AuthController', () => {
	let authController: AuthController;
	let authService: AuthService;

	const testUserData: AuthDto = { login: '@test', password: 'testPassword' };
	const responseMessage: ResponseMessageDto = { message: 'test-message', success: true };
	const headers: IncomingHttpHeaders = { authorization: 'test authorization header' };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef = await Test.createTestingModule({
			providers: [AuthService],
			controllers: [AuthController]
		}).compile();

		authController = moduleRef.get<AuthController>(AuthController);
		authService = moduleRef.get<AuthService>(AuthService);
	});

	test('should be defined', () => {
		expect(AuthController).toBeDefined();
	});

	describe('signIn-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(authService, 'signIn').mockImplementation(() => {
				return Promise.resolve((responseMessage as unknown) as AuthResponseMessageDto);
			});
			expect(await authController.signIn(testUserData)).toEqual(responseMessage);
		});
	});

	describe('singUp-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(authService, 'signUp').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await authController.signUp(testUserData as CreateUserDto)).toEqual(responseMessage);
		});
	});

	describe('changePassword-method', () => {
		test('should return response-message', async () => {
			jest.spyOn(authService, 'changePassword').mockImplementation(() => Promise.resolve(responseMessage));
			expect(await authController.changePassword(headers, testUserData as NewPasswordDto)).toEqual(responseMessage);
		});
	});
});