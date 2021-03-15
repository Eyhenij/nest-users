import { Test, TestingModule } from '@nestjs/testing';
import { AuthResponseMessageDto, ResponseMessageDto } from '../../common/response.dtos';
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

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
			controllers: [AuthController]
		}).compile();

		authController = moduleRef.get<AuthController>(AuthController);
		authService = moduleRef.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	describe('signIn', () => {
		it('should return response-message', async () => {
			jest.spyOn(authService, 'signIn').mockReturnValueOnce(Promise.resolve((responseMessage as unknown) as AuthResponseMessageDto));
			expect(await authController.signIn(testUserData)).toEqual(responseMessage);
		});
	});

	describe('singUp', () => {
		it('should return response-message', async () => {
			jest.spyOn(authService, 'signUp').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await authController.signUp(testUserData as CreateUserDto)).toEqual(responseMessage);
		});
	});

	describe('changePassword', () => {
		it('should return response-message', async () => {
			jest.spyOn(authService, 'changePassword').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await authController.changePassword(headers, testUserData as NewPasswordDto)).toEqual(responseMessage);
		});
	});
});
