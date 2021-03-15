import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	controllers: [PostsController],
	providers: [PostsService],
	imports: [SequelizeModule.forFeature([Post]), AuthModule]
})
export class PostsModule {}
