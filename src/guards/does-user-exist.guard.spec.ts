import { Test, TestingModule } from '@nestjs/testing';
import { DoesUserExistGuard } from './does-user-exist.guard';
import { UsersService } from '../modules/users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

jest.mock('../modules/users/users.service');

describe('DoesUserExistGuard', () => {
	let authService: UsersService;
	let doesUserExistGuard: DoesUserExistGuard;
	let mockExecutionContext: ExecutionContext;

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [UsersService, DoesUserExistGuard]
		}).compile();

		authService = moduleRef.get<UsersService>(UsersService);
		doesUserExistGuard = moduleRef.get<DoesUserExistGuard>(DoesUserExistGuard);
		mockExecutionContext = createMock<ExecutionContext>();
	});

	test('should be defined', () => {
		expect(doesUserExistGuard).toBeDefined();
	});

	it('mockExecutionContext to be defined', async () => {
		expect(await mockExecutionContext.switchToHttp().getRequest()).toBeDefined();
	});

	it('should call checkUserExist', async () => {
		mockExecutionContext.switchToHttp().getRequest().params = { id: '1' };
		jest.spyOn(authService, 'checkUserExist').mockReturnValueOnce(Promise.resolve(true));
		await doesUserExistGuard.canActivate(mockExecutionContext);
		expect(authService.checkUserExist).toBeCalledWith('1');
	});

	it('should return true', async () => {
		mockExecutionContext.switchToHttp().getRequest().params = { id: '1' };
		jest.spyOn(authService, 'checkUserExist').mockReturnValueOnce(Promise.resolve(true));
		expect(await doesUserExistGuard.canActivate(mockExecutionContext)).toBeTruthy();
	});

	it('should throw NotFoundException', async () => {
		jest.spyOn(authService, 'checkUserExist').mockReturnValueOnce(Promise.resolve(false));
		await expect(doesUserExistGuard.canActivate(mockExecutionContext)).rejects.toThrow();
	});
});
