import { AuthService } from '../modules/auth/auth.service';
import { AuthDto } from '../modules/auth/dto/auth.dto';
import { Test } from '@nestjs/testing';
import { User } from '../modules/users/user.model';
import { DoesLoginExistGuard } from './does-login-exist.guard';

jest.mock('../modules/auth/auth.service');

describe('DoesLoginExistGuard', () => {
	let authService: AuthService;
	let doesLoginExistGuard: DoesLoginExistGuard;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef = await Test.createTestingModule({
			providers: [AuthService, DoesLoginExistGuard]
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);
		doesLoginExistGuard = moduleRef.get<DoesLoginExistGuard>(DoesLoginExistGuard);
	});

	test('should be defined', () => {
		expect(DoesLoginExistGuard).toBeDefined();
	});

	// test('can activate', () => {
	// 	beforeEach(() => {
	// 		jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(testUser as User));
	// 	});
	// 	expect(doesLoginExistGuard.canActivate()).toBeTruthy();
	// });
});
