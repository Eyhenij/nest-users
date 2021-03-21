import { Test, TestingModule } from '@nestjs/testing';
import { WhoLikedService } from './who-liked.service';
import { getModelToken } from '@nestjs/sequelize';
import { WhoLikedModel } from './who-liked.model';

describe('WhoLikedService', () => {
	let whoLikedService: WhoLikedService;
	let whoLikedRepository;

	const testModel = { userUUID: 'userUUID', postUUID: 'postUUID' };

	const mockWhoLikedRepo = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		destroy: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				WhoLikedService,
				{
					provide: getModelToken(WhoLikedModel),
					useValue: mockWhoLikedRepo
				}
			]
		}).compile();

		whoLikedService = moduleRef.get<WhoLikedService>(WhoLikedService);
		whoLikedRepository = moduleRef.get<WhoLikedModel>(getModelToken(WhoLikedModel));
	});

	it('should be defined', () => {
		expect(whoLikedService).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users who liked post', async () => {
			jest.spyOn(whoLikedRepository, 'findAll').mockReturnValueOnce([testModel as WhoLikedModel]);
			expect(await whoLikedService.findAll('postUUID')).toEqual([testModel as WhoLikedModel]);
		});
	});

	describe('findOneByUserUUID', () => {
		it('should return one user liked post', async () => {
			jest.spyOn(whoLikedRepository, 'findOne').mockReturnValueOnce(testModel as WhoLikedModel);
			expect(await whoLikedService.findOneByUserUUID('userUUID', 'postUUID')).toEqual(testModel as WhoLikedModel);
		});
	});

	describe('makeLike', () => {
		it('should be called', async () => {
			jest.spyOn(whoLikedRepository, 'create').mockReturnValueOnce(testModel as WhoLikedModel);
			await whoLikedService.makeLike('userUUID', 'postUUID');
			expect(whoLikedRepository.create).toBeCalled();
		});
	});

	describe('rollbackLike', () => {
		it('should be called', async () => {
			jest.spyOn(whoLikedRepository, 'destroy').mockReturnValueOnce(null);
			await whoLikedService.rollbackLike('userUUID', 'postUUID');
			expect(whoLikedRepository.destroy).toBeCalled();
		});
	});
});
