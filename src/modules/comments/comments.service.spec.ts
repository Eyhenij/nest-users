import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CommentContainerDto } from './dto/commentContainerDto';

describe('CommentsService', () => {
	let commentService: CommentsService;
	let commentRepository;

	const testComment = { userUUID: 'test', parentUUID: 'test', content: 'test' };
	const testCommentContainer = {
		parentUUID: 'postUUID',
		comments: [testComment]
	};

	const mockCommentRepo = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		destroy: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				CommentsService,
				{
					provide: getModelToken(Comment),
					useValue: mockCommentRepo
				}
			]
		}).compile();

		commentService = moduleRef.get<CommentsService>(CommentsService);
		commentRepository = moduleRef.get<Comment>(getModelToken(Comment));
	});

	it('should be defined', () => {
		expect(commentService).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of comments-container', async () => {
			jest.spyOn(commentRepository, 'findAll').mockReturnValueOnce([testComment] as Comment[]);
			expect(await commentService.findAll('postUUID')).toEqual(testCommentContainer as CommentContainerDto);
		});
	});

	describe('create', () => {
		it('should return created comment', async () => {
			jest.spyOn(commentRepository, 'create').mockReturnValueOnce(testComment as Comment);
			expect(await commentService.create(testComment as CreateCommentDto)).toEqual(testComment as Comment);
		});
	});

	describe('updateOne', () => {
		it('should return response-message', async () => {
			jest.spyOn(commentRepository, 'update').mockReturnValueOnce(Promise.resolve());
			expect(await commentService.updateOne((testComment as unknown) as UpdateCommentDto)).toEqual({
				message: 'update comment:success',
				success: true
			});
		});
	});

	describe('remove', () => {
		it('should return response-message', async () => {
			jest.spyOn(commentRepository, 'destroy').mockReturnValueOnce(Promise.resolve());
			expect(await commentService.remove('commentUUID')).toEqual({
				message: 'delete comment:success',
				success: true
			});
		});
	});
});
