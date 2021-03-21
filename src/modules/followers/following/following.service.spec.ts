import { Test, TestingModule } from '@nestjs/testing';
import { FollowingService } from './following.service';
import { getModelToken } from '@nestjs/sequelize';
import { Following } from './following.model';
import { Followed } from '../followed/followed.model';

describe('FollowingService', () => {
	let followingService: FollowingService;
	let followingRepository;

	const testFollowing = { userUUID: 'test', followedUUID: 'test' };

	const mockFollowingRepo = {
		findAll: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				FollowingService,
				{
					provide: getModelToken(Following),
					useValue: mockFollowingRepo
				}
			]
		}).compile();

		followingService = moduleRef.get<FollowingService>(FollowingService);
		followingRepository = moduleRef.get<Following>(getModelToken(Following));
	});

	it('should be defined', () => {
		expect(followingService).toBeDefined();
	});

	describe('findAllFollowing', () => {
		it('should return an array followed users', async () => {
			jest.spyOn(followingRepository, 'findAll').mockReturnValueOnce([testFollowing] as Followed[]);
			expect(await followingService.findAllFollowing('postUUID')).toEqual([testFollowing] as Followed[]);
		});
	});
});
