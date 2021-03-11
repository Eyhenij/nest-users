import { AuthModule } from './auth.module';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthModule', () => {
	let authModule: AuthModule;

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AuthModule]
		}).compile();

		authModule = moduleRef.get<AuthModule>(AuthModule);
	});

	it('should be defined', () => {
		expect(authModule).toBeDefined();
	});
});
