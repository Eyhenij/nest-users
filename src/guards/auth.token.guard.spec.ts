import { AuthService } from '../modules/auth/auth.service';
import { Test } from '@nestjs/testing';
import { AuthTokenGuard } from './auth.token.guard';
import { User } from '../modules/users/user.model';
import { AuthDto } from '../modules/auth/dto/auth.dto';
import { ExecutionContext } from '@nestjs/common';

jest.mock('../modules/auth/auth.service');
jest.genMockFromModule('@nestjs/common');

describe('AuthTokenGuard', () => {
	let authService: AuthService;
	let authTokenGuard: AuthTokenGuard;
	// let mockExecutionContext: ExecutionContext;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };

	const mockExecutionContext = {
		switchToHttp: jest.fn(() => ({
			getRequest: jest.fn(() => ({
				originalUrl: '/',
				method: 'GET',
				params: undefined,
				query: undefined,
				body: {

				},
			})),
			getResponse: jest.fn(() => ({
				statusCode: 200,
			}))
		}))
	};

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef = await Test.createTestingModule({
			providers: [AuthService, AuthTokenGuard]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		authTokenGuard = moduleRef.get<AuthTokenGuard>(AuthTokenGuard);
	});

	test('should be defined', () => {
		expect(AuthTokenGuard).toBeDefined();
	});

	// test('can activate', () => {
	// 	beforeEach(() => {
	// 		// jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
	// 		// 	.mockReturnValueOnce(Promise.resolve(null));
	// 		jest.spyOn(authService, 'verifyToken').mockReturnValueOnce(Promise.resolve(testUser as User));
	// 	});
	// 	expect(authTokenGuard.canActivate((mockExecutionContext as unknown) as ExecutionContext)).toBeTruthy();
	// });
});
