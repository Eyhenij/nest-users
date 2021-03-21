import { Test, TestingModule } from '@nestjs/testing';
import { FollowedService } from './followed.service';
import { getModelToken } from '@nestjs/sequelize';
import { Followed } from './followed.model';

describe('FollowersService', () => {
	let followedService: FollowedService;
	let followedRepository;

	const testFollowed = { userUUID: 'test', followedUUID: 'test' };

	const mockFollowedRepo = {
		findAll: jest.fn(),
		create: jest.fn(),
		destroy: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				FollowedService,
				{
					provide: getModelToken(Followed),
					useValue: mockFollowedRepo
				}
			]
		}).compile();

		followedService = moduleRef.get<FollowedService>(FollowedService);
		followedRepository = moduleRef.get<Followed>(getModelToken(Followed));
	});

	it('should be defined', () => {
		expect(followedService).toBeDefined();
	});

	describe('findAllFollowed', () => {
		it('should return an array followed users', async () => {
			jest.spyOn(followedRepository, 'findAll').mockReturnValueOnce([testFollowed] as Followed[]);
			expect(await followedService.findAllFollowed('postUUID')).toEqual([testFollowed] as Followed[]);
		});
	});

	describe('follow', () => {
		it('should return response-message', async () => {
			jest.spyOn(followedRepository, 'create').mockReturnValueOnce(testFollowed as Followed);
			expect(await followedService.follow('followedUUID')).toEqual({
				message: 'follow:success',
				success: true
			});
		});
	});

	describe('unfollow', () => {
		it('should return response-message', async () => {
			jest.spyOn(followedRepository, 'destroy').mockReturnValueOnce(Promise.resolve());
			expect(await followedService.unfollow('followedUUID')).toEqual({
				message: 'unfollow:success',
				success: true
			});
		});
	});
});
