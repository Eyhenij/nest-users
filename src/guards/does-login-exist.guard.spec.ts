import { AuthService } from '../modules/auth/auth.service';
import { AuthDto } from '../modules/auth/dto/auth.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../modules/users/user.model';
import { DoesLoginExistGuard } from './does-login-exist.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

jest.mock('../modules/auth/auth.service');

describe('DoesLoginExistGuard', () => {
	let authService: AuthService;
	let doesLoginExistGuard: DoesLoginExistGuard;
	let mockExecutionContext: ExecutionContext;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthService, DoesLoginExistGuard]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		doesLoginExistGuard = moduleRef.get<DoesLoginExistGuard>(DoesLoginExistGuard);
		mockExecutionContext = createMock<ExecutionContext>();
	});

	test('should be defined', () => {
		expect(doesLoginExistGuard).toBeDefined();
	});

	it('mockExecutionContext to be defined', async () => {
		expect(await mockExecutionContext.switchToHttp().getRequest()).toBeDefined();
	});

	it('should call findLogin', async () => {
		mockExecutionContext.switchToHttp().getRequest().body = { login: '@test' };
		jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(null));
		await doesLoginExistGuard.canActivate(mockExecutionContext);
		expect(authService.findLogin).toBeCalledWith('@test');
	});

	it('should return true', async () => {
		mockExecutionContext.switchToHttp().getRequest().body = { login: '@test' };
		jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(null));
		expect(await doesLoginExistGuard.canActivate(mockExecutionContext)).toBeTruthy();
	});

	it('should throw UnauthorizedException', async () => {
		mockExecutionContext.switchToHttp().getRequest().body = { login: '@test' };
		jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(testUser as User));
		await expect(doesLoginExistGuard.canActivate(mockExecutionContext)).rejects.toThrow();
	});
});
