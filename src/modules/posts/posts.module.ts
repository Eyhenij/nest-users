import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { AuthModule } from '../auth/auth.module';
import { WhoLikedModel } from './who-liked/whoLiked.model';
import { WhoLikedService } from './who-liked/whoLiked.service';
import { WhoDislikedService } from './who-disliked/whoDisliked.service';
import { WhoDislikedModel } from './who-disliked/whoDisliked.model';

@Module({
	controllers: [PostsController],
	providers: [PostsService, WhoLikedService, WhoDislikedService],
	imports: [SequelizeModule.forFeature([Post, WhoLikedModel, WhoDislikedModel]), AuthModule]
})
export class PostsModule {}
