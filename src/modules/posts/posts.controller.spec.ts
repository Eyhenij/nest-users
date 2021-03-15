import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthService } from '../auth/auth.service';
import { Post } from './post.model';
import { CreatePostDto } from './dto/createPost.dto';
import { ResponseMessageDto } from '../../common/response.dtos';

jest.mock('../auth/auth.service');
jest.mock('./posts.service');

describe('PostsController', () => {
	let postsController: PostsController;
	let postsService: PostsService;

	const testPost = { userUUID: 'test', title: 'test', content: 'test' };
	const responseMessage: ResponseMessageDto = { message: 'test message', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [PostsService, AuthService],
			controllers: [PostsController]
		}).compile();

		postsController = moduleRef.get<PostsController>(PostsController);
		postsService = moduleRef.get<PostsService>(PostsService);
	});

	it('should be defined', () => {
		expect(postsController).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			jest.spyOn(postsService, 'findAll').mockReturnValueOnce(Promise.resolve([testPost] as Post[]));
			expect(await postsController.findAll({ userUUID: '1' })).toEqual([testPost]);
		});
	});

	describe('findOne', () => {
		it('should return one user', async () => {
			jest.spyOn(postsService, 'findOneById').mockReturnValueOnce(Promise.resolve(testPost as Post));
			expect(await postsController.findOne({ userUUID: '1' }, '1')).toEqual(testPost);
		});
	});

	describe('create', () => {
		it('should return response-message', async () => {
			jest.spyOn(postsService, 'create').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await postsController.create(testPost as CreatePostDto)).toEqual(responseMessage);
		});
	});

	describe('updateOne', () => {
		it('should return response-message', async () => {
			jest.spyOn(postsService, 'updateOne').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await postsController.updateOne(testPost as CreatePostDto, '1')).toEqual(responseMessage);
		});
	});

	describe('remove', () => {
		it('remove-method should return response-message', async () => {
			jest.spyOn(postsService, 'remove').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await postsController.remove({ userUUID: '1' }, '1')).toEqual(responseMessage);
		});
	});
});
