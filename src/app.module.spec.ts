import { Test } from '@nestjs/testing';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

jest.mock('./modules/users/users.module');
jest.mock('./modules/auth/auth.module');

describe('AppModule', () => {
	beforeEach(async () => {
		jest.resetAllMocks();
		await Test.createTestingModule({
			providers: [AppService],
			controllers: [AppController],
			imports: [AuthModule, UsersModule, SequelizeModule]
		}).compile();
	});

	it('should be defined', () => {
		expect(AppModule).toBeDefined();
	});
});
