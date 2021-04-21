import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Followed } from './followed/followed.model';
import { Following } from './following/following.model';
import { FollowedService } from './followed/followed.service';
import { FollowersController } from './followers.controller';
import { AuthModule } from '../auth/auth.module';
import { FollowingService } from './following/following.service';

@Module({
	providers: [FollowedService, FollowingService],
	controllers: [FollowersController],
	imports: [SequelizeModule.forFeature([Followed, Following]), AuthModule]
})
export class FollowersModule {}
