import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { AuthService } from '../auth/auth.service';
import { CommentsService } from './comments.service';
import { ResponseMessageDto } from '../../common/response.dtos';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from './comment.model';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CommentContainerDto } from './dto/commentContainerDto';

jest.mock('../auth/auth.service');
jest.mock('./comments.service');

describe('CommentsController', () => {
	let commentsController: CommentsController;
	let commentsService: CommentsService;

	const testComment = { userUUID: 'test', parentUUID: 'test', content: 'test' };
	const responseMessage: ResponseMessageDto = { message: 'test message', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [CommentsService, AuthService],
			controllers: [CommentsController]
		}).compile();

		commentsController = moduleRef.get<CommentsController>(CommentsController);
		commentsService = moduleRef.get<CommentsService>(CommentsService);
	});

	it('should be defined', () => {
		expect(commentsController).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			jest.spyOn(commentsService, 'findAll').mockReturnValueOnce(Promise.resolve(
				([testComment] as unknown) as CommentContainerDto)
			);
			expect(await commentsController.findAll('1')).toEqual([testComment]);
		});
	});

	describe('create', () => {
		it('should return new post', async () => {
			jest.spyOn(commentsService, 'create').mockReturnValueOnce(Promise.resolve(testComment as Comment));
			expect(await commentsController.create(testComment as CreateCommentDto)).toEqual(testComment);
		});
	});

	describe('updateOne', () => {
		it('should return response-message', async () => {
			jest.spyOn(commentsService, 'updateOne').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await commentsController.updateOne((testComment as unknown) as UpdateCommentDto)).toEqual(responseMessage);
		});
	});

	describe('remove', () => {
		it('should return response-message', async () => {
			jest.spyOn(commentsService, 'remove').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await commentsController.remove('1')).toEqual(responseMessage);
		});
	});
});
