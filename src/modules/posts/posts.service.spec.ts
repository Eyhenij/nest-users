import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/sequelize';
import { Post } from './post.model';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';

describe('PostsService', () => {
	let postsService: PostsService;
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
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				PostsService,
				{
					provide: getModelToken(Post),
					useValue: mockPostsRepo
				}
			]
		}).compile();

		postsService = moduleRef.get<PostsService>(PostsService);
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
		describe('return result', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost as Post);
				jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost as Post);
			});

			it('should return response-message (with rollback: true)', async () => {
				expect(await postsService.makeLike(true, '1')).toEqual({
					message: 'rollback like post:success',
					success: true
				});
			});

			it('should return response-message (with rollback: false)', async () => {
				expect(await postsService.makeLike(false, '1')).toEqual({
					message: 'like post:success',
					success: true
				});
			});

			it('should call postsRepository.findOne with postUUID-param', async () => {
				await postsService.makeLike(true, '1');
				expect(postsRepository.findOne).toBeCalledWith({ where: { postUUID: '1' } });
			});

			it('should call postsRepository.update', async () => {
				await postsService.makeLike(true, '1');
				expect(postsRepository.update).toBeCalled();
			});
		});

		describe('return exception', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(Promise.resolve(null));
			});

			it('should throw NotFoundException', async () => {
				await expect(postsService.makeLike(true, '1')).rejects.toThrow(NotFoundException);
			});

			it('should not throw other exception', async () => {
				await expect(postsService.makeLike(true, '1')).rejects.not.toThrow(BadRequestException);
			});
		});
	});

	describe('makeDisLike', () => {
		describe('return result', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(testPost as Post);
				jest.spyOn(postsRepository, 'update').mockReturnValueOnce(testPost as Post);
			});

			it('should return response-message (with rollback: true)', async () => {
				expect(await postsService.makeDisLike(true, '1')).toEqual({
					message: 'rollback dislike post:success',
					success: true
				});
			});

			it('should return response-message (with rollback: false)', async () => {
				expect(await postsService.makeDisLike(false, '1')).toEqual({
					message: 'dislike post:success',
					success: true
				});
			});

			it('should call postsRepository.findOne with postUUID-param', async () => {
				await postsService.makeDisLike(true, '1');
				expect(postsRepository.findOne).toBeCalledWith({ where: { postUUID: '1' } });
			});

			it('should call postsRepository.update', async () => {
				await postsService.makeDisLike(true, '1');
				expect(postsRepository.update).toBeCalled();
			});
		});

		describe('return exception', () => {
			beforeEach(() => {
				jest.spyOn(postsRepository, 'findOne').mockReturnValueOnce(Promise.resolve(null));
			});

			it('should throw NotFoundException', async () => {
				await expect(postsService.makeDisLike(true, '1')).rejects.toThrow(NotFoundException);
			});

			it('should not throw other exception', async () => {
				await expect(postsService.makeDisLike(true, '1')).rejects.not.toThrow(BadRequestException);
			});
		});
	});
});
