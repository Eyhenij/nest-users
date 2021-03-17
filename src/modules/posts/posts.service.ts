import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseMessageDto } from '../../common/response.dtos';
import { Post } from './post.model';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(Post)
		private readonly _postsRepository: typeof Post
	) {}

	public async findAll(userUUID: string): Promise<Post[]> {
		try {
			return await this._postsRepository.findAll<Post>({ where: { userUUID } });
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}

	public async findOneById(userUUID: string, postUUID: string): Promise<Post> {
		try {
			return await this._postsRepository.findOne<Post>({ where: { userUUID, postUUID } });
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}

	public async create(createPostData: CreatePostDto): Promise<Post> {
		try {
			return await this._postsRepository.create<Post>({ ...createPostData });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	public async updateOne(updatePostData: CreatePostDto, postUUID: string): Promise<ResponseMessageDto> {
		try {
			const { userUUID, ...postData } = updatePostData;
			await this._postsRepository.update<Post>({ ...postData }, { where: { userUUID, postUUID } });
			return { message: 'update post:success', success: true };
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	public async remove(postUUID: string): Promise<ResponseMessageDto> {
		try {
			await this._postsRepository.destroy<Post>({ where: { postUUID } });
			return { message: 'delete post:success', success: true };
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}

	public async makeLike(rollback: boolean, postUUID: string): Promise<ResponseMessageDto> {
		const responseMessage: ResponseMessageDto = { message: 'like post:success', success: true };
		const post = await this._postsRepository.findOne<Post>({ where: { postUUID } });
		if (post) {
			let newCountOfLikes = post.countOfLikes;
			if (rollback) {
				newCountOfLikes--;
				responseMessage.message = 'rollback like post:success';
			} else {
				newCountOfLikes++;
			}
			await this._postsRepository.update<Post>({ countOfLikes: newCountOfLikes }, { where: { postUUID } });
			return responseMessage;
		}
		throw new NotFoundException('post not found');
	}

	public async makeDisLike(rollback: boolean, postUUID: string): Promise<ResponseMessageDto> {
		const responseMessage: ResponseMessageDto = { message: 'dislike post:success', success: true };
		const post = await this._postsRepository.findOne<Post>({ where: { postUUID } });
		if (post) {
			let newCountOfDisLikes = post.countOfDislikes;
			if (rollback) {
				newCountOfDisLikes--;
				responseMessage.message = 'rollback dislike post:success';
			} else {
				newCountOfDisLikes++;
			}
			await this._postsRepository.update<Post>({ countOfDislikes: newCountOfDisLikes }, { where: { postUUID } });
			return responseMessage;
		}
		throw new NotFoundException('post not found');
	}
}
