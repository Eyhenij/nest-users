import { AuthService } from '../modules/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokenGuard } from './auth.token.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { User } from '../modules/users/user.model';

jest.mock('../modules/auth/auth.service');
jest.genMockFromModule('@nestjs/common');

describe('AuthTokenGuard', () => {
	let authService: AuthService;
	let authTokenGuard: AuthTokenGuard;
	let mockExecutionContext: ExecutionContext;

	const testUser = { login: '@test', password: 'testPassword' };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthService, AuthTokenGuard]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		authTokenGuard = moduleRef.get<AuthTokenGuard>(AuthTokenGuard);
		mockExecutionContext = createMock<ExecutionContext>();
	});

	it('should be defined', () => {
		expect(authTokenGuard).toBeDefined();
	});

	it('mockExecutionContext to be defined', async () => {
		expect(await mockExecutionContext.switchToHttp().getRequest()).toBeDefined();
	});

	it('should call verifyToken', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyToken').mockReturnValueOnce(Promise.resolve(testUser as User));
		await authTokenGuard.canActivate(mockExecutionContext);
		expect(authService.verifyToken).toBeCalledWith('test-token');
	});

	it('should return true', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyToken').mockReturnValueOnce(Promise.resolve(testUser as User));
		expect(await authTokenGuard.canActivate(mockExecutionContext)).toBeTruthy();
	});

	it('should return false', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyToken').mockReturnValueOnce(Promise.resolve(null));
		expect(await authTokenGuard.canActivate(mockExecutionContext)).toBeFalsy();
	});

	it('should throw UnauthorizedException', async () => {
		mockExecutionContext.switchToHttp().getRequest = () => null;
		await expect(authTokenGuard.canActivate(mockExecutionContext)).rejects.toThrow();
	});
});
