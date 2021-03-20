import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comment.model';

@Module({
	controllers: [CommentsController],
	providers: [CommentsService],
	imports: [SequelizeModule.forFeature([Comment]), AuthModule]
})
export class CommentsModule {}
