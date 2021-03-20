import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/sequelize';
import { Post } from './post.model';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { WhoLikedService } from './who-liked/who-liked.service';
import { WhoDislikedService } from './who-disliked/who-disliked.service';
import { WhoDislikedModel } from './who-disliked/who-disliked.model';
import { WhoLikedModel } from './who-liked/who-liked.model';

jest.mock('./who-liked/who-liked.service');
jest.mock('./who-disliked/who-disliked.service');

describe('PostsService', () => {
	let postsService: PostsService;
	let whoLikedService: WhoLikedService;
	let whoDislikedService: WhoDislikedService;
	let postsRepository;

	const testPost = { userUUID: 'test', title: 'test', content: 'test' };

	const mockPostsRepo = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		truncate: jest.fn(),
		bulkCreate: jest.fn(),
		update: jest.fn(),
		destroy: jest.fn()
	};

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				PostsService,
				WhoLikedService,
				WhoDislikedService,
				{
					provide: getModelToken(Post),
					useValue: mockPostsRepo
				}
			]
		}).compile();

		postsService = moduleRef.get<PostsService>(PostsService);
		whoLikedService = moduleRef.get<WhoLikedService>(WhoLikedService);
		whoDislikedService = moduleRef.get<WhoDislikedService>(WhoDislikedService);
		postsRepository = moduleRef.get<Post>(getModelToken(Post));
	});

	it('should be defined', () => {
		expect(postsService).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			jest.spyOn(postsRepository, 'findAll').mockReturnValueOnce([testPost]);
			expect(await postsService.findAll('1')).toEqual([testPost]);
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(postsRepository, 'findAll').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.findAll('1')).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(postsRepository, 'findAll').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.findAll('1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('findOneById', () => {
		it('should return one user', async () => {
			jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost);
			expect(await postsService.findOneById('1', '1')).toEqual(testPost);
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.findOneById('1', '1')).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.findOneById('1', '1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should return new post', async () => {
			jest.spyOn(postsRepository, 'create').mockReturnValueOnce(testPost);
			expect(await postsService.create(testPost as CreatePostDto)).toEqual(testPost);
		});

		it('should throw BadRequestException', async () => {
			jest.spyOn(postsRepository, 'create').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.create(testPost as CreatePostDto)).rejects.toThrow(BadRequestException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(postsRepository, 'create').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.create(testPost as CreatePostDto)).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('updateOne', () => {
		it('should return response-message', async () => {
			jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost);
			expect(await postsService.updateOne(testPost, '1')).toEqual({
				message: 'update post:success',
				success: true
			});
		});

		it('should throw BadRequestException', async () => {
			jest.spyOn(postsRepository, 'update').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.updateOne(testPost, '1')).rejects.toThrow(BadRequestException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(postsRepository, 'update').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.updateOne(testPost, '1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('remove', () => {
		it('should return response-message', async () => {
			jest.spyOn(postsRepository, 'destroy').mockReturnValueOnce(testPost);
			expect(await postsService.remove('1')).toEqual({
				message: 'delete post:success',
				success: true
			});
		});

		it('should throw InternalServerErrorException', async () => {
			jest.spyOn(postsRepository, 'destroy').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.remove('1')).rejects.toThrow(InternalServerErrorException);
		});

		it('should not throw NotFoundException', async () => {
			jest.spyOn(postsRepository, 'destroy').mockReturnValueOnce(Promise.reject(new Error()));
			await expect(postsService.remove('1')).rejects.not.toThrow(NotFoundException);
		});
	});

	describe('makeLike', () => {
		describe('if post exists and isLiked = true', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost as Post);
				jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost as Post);
				jest.spyOn(whoLikedService, 'findOneByUserUUID').mockReturnValueOnce(
					Promise.resolve((testPost as unknown) as WhoLikedModel)
				);
			});

			it('should return response-message (with rollback: true)', async () => {
				expect(await postsService.makeLike('1', '1', true)).toEqual({
					message: 'rollback like:success',
					success: true
				});
			});

			it('should return response-message (with rollback: false)', async () => {
				await expect(postsService.makeLike('1', '1', false)).rejects.toThrow(BadRequestException);
			});

			it('should call postsRepository.findOne with postUUID-param', async () => {
				await postsService.makeLike('1', '1', true);
				expect(postsRepository.findOne).toBeCalledWith({ where: { postUUID: '1' } });
			});

			it('should call postsRepository.update', async () => {
				await postsService.makeLike('1', '1', true);
				expect(postsRepository.update).toBeCalled();
			});

			it('should call whoLikedService.findOneByUserUUID', async () => {
				await postsService.makeLike('userUUID', '1', true);
				expect(whoLikedService.findOneByUserUUID).toBeCalledWith('userUUID', '1');
			});

			it('should call whoLikedService.rollbackLike', async () => {
				await postsService.makeLike('userUUID', 'postUUID', true);
				expect(whoLikedService.rollbackLike).toBeCalledWith('userUUID', 'postUUID');
			});
		});

		describe('if post does not exist and isLiked = false', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost as Post);
				jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost as Post);
				jest.spyOn(whoLikedService, 'findOneByUserUUID').mockReturnValueOnce(Promise.resolve(null));
			});

			it('should return response-message (with rollback: false)', async () => {
				expect(await postsService.makeLike('1', '1', false)).toEqual({
					message: 'like:success',
					success: true
				});
			});

			it('should return exception (with rollback: true)', async () => {
				await expect(postsService.makeLike('1', '1', true)).rejects.toThrow(BadRequestException);
			});

			it('should call whoLikedService.makeLike', async () => {
				await postsService.makeLike('userUUID', 'postUUID', false);
				expect(whoLikedService.makeLike).toBeCalledWith('userUUID', 'postUUID');
			});
		});

		describe('should return exception', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(Promise.resolve(null));
			});

			it('should throw NotFoundException', async () => {
				await expect(postsService.makeLike('1', '1', true)).rejects.toThrow(NotFoundException);
			});

			it('should not throw other exception', async () => {
				await expect(postsService.makeLike('1', '1', true)).rejects.not.toThrow(BadRequestException);
			});
		});
	});

	describe('makeDislike', () => {
		describe('if post exists and isDisliked = true', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost as Post);
				jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost as Post);
				jest.spyOn(whoDislikedService, 'findOneByUserUUID').mockReturnValueOnce(
					Promise.resolve((testPost as unknown) as WhoDislikedModel)
				);
			});

			it('should return response-message (with rollback: true)', async () => {
				expect(await postsService.makeDisLike('1', '1', true)).toEqual({
					message: 'rollback dislike:success',
					success: true
				});
			});

			it('should return exception (with rollback: false)', async () => {
				await expect(postsService.makeDisLike('1', '1', false)).rejects.toThrow(BadRequestException);
			});

			it('should call postsRepository.findOne with postUUID-param', async () => {
				await postsService.makeDisLike('1', '1', true);
				expect(postsRepository.findOne).toBeCalledWith({ where: { postUUID: '1' } });
			});

			it('should call postsRepository.update', async () => {
				await postsService.makeDisLike('1', '1', true);
				expect(postsRepository.update).toBeCalled();
			});

			it('should call whoDislikedService.findOneByUserUUID', async () => {
				await postsService.makeDisLike('userUUID', '1', true);
				expect(whoDislikedService.findOneByUserUUID).toBeCalledWith('userUUID', '1');
			});

			it('should call whoDislikedService.rollbackDislike', async () => {
				await postsService.makeDisLike('userUUID', 'postUUID', true);
				expect(whoDislikedService.rollbackDislike).toBeCalledWith('userUUID', 'postUUID');
			});
		});

		describe('if post does not exist and isDisliked = false', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost as Post);
				jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost as Post);
				jest.spyOn(whoDislikedService, 'findOneByUserUUID').mockReturnValueOnce(Promise.resolve(null));
			});

			it('should return response-message (with rollback: false)', async () => {
				expect(await postsService.makeDisLike('1', '1', false)).toEqual({
					message: 'dislike:success',
					success: true
				});
			});

			it('should return exception (with rollback: true)', async () => {
				await expect(postsService.makeDisLike('1', '1', true)).rejects.toThrow(BadRequestException);
			});

			it('should call whoDislikedService.makeDislike', async () => {
				await postsService.makeDisLike('userUUID', 'postUUID', false);
				expect(whoDislikedService.makeDislike).toBeCalledWith('userUUID', 'postUUID');
			});
		});

		describe('should return exception', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(Promise.resolve(null));
			});

			it('should throw NotFoundException', async () => {
				await expect(postsService.makeDisLike('1', '1', true)).rejects.toThrow(NotFoundException);
			});

			it('should not throw other exception', async () => {
				await expect(postsService.makeDisLike('1', '1', true)).rejects.not.toThrow(BadRequestException);
			});
		});
	});
});
