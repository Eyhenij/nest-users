import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Post } from '../../database/models/post.model';

@Module({
	providers: [UsersService],
	controllers: [UsersController],
	imports: [SequelizeModule.forFeature([User, Post])],
	exports: [SequelizeModule]
})
export class UsersModule {}
