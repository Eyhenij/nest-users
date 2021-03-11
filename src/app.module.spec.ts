import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
	let appModule: AppModule;

	beforeEach(async () => {
		jest.resetAllMocks();
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [AppModule]
		}).compile();

		appModule = moduleRef.get<AppModule>(AppModule);
	});

	it('should be defined', () => {
		expect(appModule).toBeDefined();
	});
});
