import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
	let usersModule: UsersModule;

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [UsersModule]
		}).compile();

		usersModule = moduleRef.get<UsersModule>(UsersModule);
	});

	it('should be defined', () => {
		expect(usersModule).toBeDefined();
	});
});
