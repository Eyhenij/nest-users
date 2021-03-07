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

	const testUserData: AuthDto = { login: '@test', password: 'someTestPasswordString' };
	const responseMessage: ResponseMessageDto = { message: 'there is some message from authService', success: true };
	const headers: IncomingHttpHeaders = { authorization: 'some test authorization header' };

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

	test('singIn-method should return auth-response-message', async () => {
		jest.spyOn(authService, 'signIn').mockImplementation(() => {
			return Promise.resolve((responseMessage as unknown) as AuthResponseMessageDto);
		});
		expect(await authController.signIn(testUserData)).toEqual(responseMessage);
	});

	test('singUp-method should return response-message', async () => {
		jest.spyOn(authService, 'signUp').mockImplementation(() => Promise.resolve(responseMessage));
		expect(await authController.signUp(testUserData as CreateUserDto)).toEqual(responseMessage);
	});

	test('changePassword-method should return response-message', async () => {
		jest.spyOn(authService, 'changePassword').mockImplementation(() => Promise.resolve(responseMessage));
		expect(await authController.changePassword(headers, testUserData as NewPasswordDto)).toEqual(responseMessage);
	});
});
