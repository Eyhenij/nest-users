import { AuthService } from '../modules/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { RoleGuard } from './role.guard';

jest.mock('../modules/auth/auth.service');

describe('DoesLoginExistGuard', () => {
	let authService: AuthService;
	let roleGuard: RoleGuard;
	let mockExecutionContext: ExecutionContext;

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthService, RoleGuard]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		roleGuard = moduleRef.get<RoleGuard>(RoleGuard);
		mockExecutionContext = createMock<ExecutionContext>();
	});

	it('should be defined', () => {
		expect(roleGuard).toBeDefined();
	});

	it('mockExecutionContext to be defined', async () => {
		expect(await mockExecutionContext.switchToHttp().getRequest()).toBeDefined();
	});

	it('should call verifyUserRole', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyUserRole').mockReturnValueOnce(Promise.resolve('admin'));
		await roleGuard.canActivate(mockExecutionContext);
		expect(authService.verifyUserRole).toBeCalledWith('test-token');
	});

	it('should return true', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyUserRole').mockReturnValueOnce(Promise.resolve('admin'));
		expect(await roleGuard.canActivate(mockExecutionContext)).toBeTruthy();
	});

	it('should return false', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyUserRole').mockReturnValueOnce(Promise.resolve('test-role'));
		expect(await roleGuard.canActivate(mockExecutionContext)).toBeFalsy();
	});

	it('should return false', async () => {
		mockExecutionContext.switchToHttp().getRequest().headers = { authorization: 'test-token' };
		jest.spyOn(authService, 'verifyUserRole').mockReturnValueOnce(Promise.resolve(null));
		expect(await roleGuard.canActivate(mockExecutionContext)).toBeFalsy();
	});

	it('should throw exception', async () => {
		mockExecutionContext.switchToHttp().getRequest = () => null;
		await expect(roleGuard.canActivate(mockExecutionContext)).rejects.toThrow();
	});
});
