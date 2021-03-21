import { Test, TestingModule } from '@nestjs/testing';
import { FollowersController } from './followers.controller';
import { FollowedService } from './followed/followed.service';
import { FollowingService } from './following/following.service';
import { Followed } from './followed/followed.model';
import { ResponseMessageDto } from '../../common/response.dtos';
import { Following } from './following/following.model';
import { AuthService } from '../auth/auth.service';

jest.mock('./followed/followed.service');
jest.mock('./following/following.service');
jest.mock('../auth/auth.service');

describe('FollowersController', () => {
	let followersController: FollowersController;
	let followedService: FollowedService;
	let followingService: FollowingService;

	const testFollower = { userUUID: 'test', followerUUID: 'test' };
	const responseMessage: ResponseMessageDto = { message: 'test message', success: true };

	beforeEach(async () => {
		jest.resetAllMocks();

		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [FollowedService, FollowingService, AuthService],
			controllers: [FollowersController]
		}).compile();

		followersController = moduleRef.get<FollowersController>(FollowersController);
		followedService = moduleRef.get<FollowedService>(FollowedService);
		followingService = moduleRef.get<FollowingService>(FollowingService);
	});

	it('should be defined', () => {
		expect(followersController).toBeDefined();
	});

	describe('findAllFollowed', () => {
		it('should return an array of followed users', async () => {
			jest.spyOn(followedService, 'findAllFollowed').mockReturnValueOnce(Promise.resolve(
				([testFollower] as unknown) as Followed[])
			);
			expect(await followersController.findAllFollowed('userUUID')).toEqual(
				([testFollower] as unknown) as Followed[]
			);
		});
	});

	describe('follow', () => {
		it('should return response-message', async () => {
			jest.spyOn(followedService, 'follow').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await followersController.follow('followedUUID')).toEqual(responseMessage);
		});
	});

	describe('unfollow', () => {
		it('should return response-message', async () => {
			jest.spyOn(followedService, 'unfollow').mockReturnValueOnce(Promise.resolve(responseMessage));
			expect(await followedService.unfollow('followedUUID')).toEqual(responseMessage);
		});
	});

	describe('findAllFollowing', () => {
		it('should return an array of following users', async () => {
			jest.spyOn(followingService, 'findAllFollowing').mockReturnValueOnce(
				Promise.resolve(([testFollower] as unknown) as Following[])
			);
			expect(await followersController.findAllFollowing('1')).toEqual(([testFollower] as unknown) as Following[]);
		});
	});
});
