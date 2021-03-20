import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
	providers: [UsersService],
	controllers: [UsersController],
	imports: [SequelizeModule.forFeature([User]), AuthModule]
})
export class UsersModule {}
