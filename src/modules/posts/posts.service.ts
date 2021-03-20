import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseMessageDto } from '../../common/response.dtos';
import { Post } from './post.model';
import { CreatePostDto } from './dto/createPost.dto';
import { WhoLikedService } from './who-liked/who-liked.service';
import { WhoDislikedService } from './who-disliked/who-disliked.service';
import { WasPostLikedDto } from './dto/was-post-liked.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(Post)
		private readonly _postsRepository: typeof Post,
		private readonly _whoLikedService: WhoLikedService,
		private readonly _whoDislikedService: WhoDislikedService
	) {}

	public async findAll(userUUID: string): Promise<Post[]> {
		try {
			const posts = await this._postsRepository.findAll<Post>({
				where: { userUUID }
				// include: [{ model: WhoLikedModel }]
			});
			return posts.sort((a, b) => (a.updatedAt >= b.updatedAt ? -1 : 1));
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

	public async makeLike(userUUID: string, postUUID: string, rollback: boolean): Promise<ResponseMessageDto> {
		const responseMessage: ResponseMessageDto = { message: 'like:success', success: true };
		const isLiked = await this.wasLiked(userUUID, postUUID);
		const post: Post = await this._postsRepository.findOne<Post>({ where: { postUUID } });
		if (post) {
			let newCountOfLikes = post.countOfLikes;
			if (isLiked.value && rollback) {
				await this._whoLikedService.rollbackLike(userUUID, postUUID);
				newCountOfLikes--;
				responseMessage.message = 'rollback like:success';
			} else if (!isLiked.value && !rollback) {
				await this._whoLikedService.makeLike(userUUID, postUUID);
				newCountOfLikes++;
			} else {
				throw new BadRequestException('you already have done this activity');
			}
			await this._postsRepository.update<Post>({ countOfLikes: newCountOfLikes }, { where: { postUUID } });
			return responseMessage;
		}
		throw new NotFoundException('post not found');
	}

	public async wasLiked(userUUID: string, postUUID: string): Promise<WasPostLikedDto> {
		return {
			postUUID: postUUID,
			value: !!(await this._whoLikedService.findOneByUserUUID(userUUID, postUUID))
		};
	}

	public async makeDisLike(userUUID: string, postUUID: string, rollback: boolean): Promise<ResponseMessageDto> {
		const responseMessage: ResponseMessageDto = { message: 'dislike:success', success: true };
		const isDisliked = await this.wasDisliked(userUUID, postUUID);
		const post: Post = await this._postsRepository.findOne<Post>({ where: { postUUID } });
		if (post) {
			let newCountOfDisLikes = post.countOfDislikes;
			if (isDisliked.value && rollback) {
				await this._whoDislikedService.rollbackDislike(userUUID, postUUID);
				newCountOfDisLikes--;
				responseMessage.message = 'rollback dislike:success';
			} else if (!isDisliked.value && !rollback) {
				await this._whoDislikedService.makeDislike(userUUID, postUUID);
				newCountOfDisLikes++;
			} else {
				throw new BadRequestException('you already have done this activity');
			}
			await this._postsRepository.update<Post>({ countOfDislikes: newCountOfDisLikes }, { where: { postUUID } });
			return responseMessage;
		}
		throw new NotFoundException('post not found');
	}

	public async wasDisliked(userUUID: string, postUUID: string): Promise<WasPostLikedDto> {
		return {
			postUUID: postUUID,
			value: !!(await this._whoDislikedService.findOneByUserUUID(userUUID, postUUID))
		};
	}
}
