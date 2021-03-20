import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { ResponseMessageDto } from '../../common/response.dtos';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
	constructor(
		@InjectModel(Comment)
		private readonly _commentsRepository: typeof Comment
	) {}

	public async findAll(parentUUID: string): Promise<Comment[]> {
		return await this._commentsRepository.findAll<Comment>({ where: { parentUUID } });
	}

	public async findOneByUUID(commentUUID: string): Promise<Comment> {
		return await this._commentsRepository.findOne<Comment>({ where: { commentUUID } });
	}

	public async create(createCommentData: CreateCommentDto): Promise<Comment> {
		return await this._commentsRepository.create<Comment>({ ...createCommentData });
	}

	public async updateOne(updateCommentsData: UpdateCommentDto): Promise<ResponseMessageDto> {
		const { commentUUID, ...commentData } = updateCommentsData;
		await this._commentsRepository.update<Comment>({ ...commentData }, { where: { commentUUID } });
		return { message: 'update comment:success', success: true };
	}

	public async remove(commentUUID: string): Promise<ResponseMessageDto> {
		await this._commentsRepository.destroy<Comment>({ where: { commentUUID } });
		return { message: 'delete comment:success', success: true };
	}
}
