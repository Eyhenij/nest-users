import { AuthDto } from '../modules/auth/dto/auth.dto';
import { Test } from '@nestjs/testing';
import { User } from '../modules/users/user.model';
import { DoesLoginExistGuard } from './does-login-exist.guard';
import { DoesUserExistGuard } from './does-user-exist.guard';
import { UsersService } from '../modules/users/users.service';

jest.mock('../modules/users/users.service');

describe('DoesUserExistGuard', () => {
	let authService: UsersService;
	let doesUserExistGuard: DoesUserExistGuard;

	const testUser: AuthDto = { login: '@test', password: 'testPassword' };

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef = await Test.createTestingModule({
			providers: [UsersService, DoesUserExistGuard]
		}).compile();

		authService = moduleRef.get<UsersService>(UsersService);
		doesUserExistGuard = moduleRef.get<DoesUserExistGuard>(DoesUserExistGuard);
	});

	test('should be defined', () => {
		expect(DoesLoginExistGuard).toBeDefined();
	});

	// test('can activate', () => {
	// 	beforeEach(() => {
	// 		jest.spyOn(authService, 'findLogin').mockReturnValueOnce(Promise.resolve(testUser as User));
	// 	});
	// 	expect(doesUserExistGuard.canActivate()).toBeTruthy();
	// });
});

