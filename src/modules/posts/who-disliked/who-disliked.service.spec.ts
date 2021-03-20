import { Test, TestingModule } from '@nestjs/testing';
import { WhoDislikedService } from './who-disliked.service';
import { getModelToken } from '@nestjs/sequelize';
import { WhoDislikedModel } from './who-disliked.model';
import { WhoLikedModel } from '../who-liked/who-liked.model';

describe('WhoDislikedService', () => {
	let whoDislikedService: WhoDislikedService;
	let whoDislikedRepository;

	const testModel = { userUUID: 'userUUID', postUUID: 'postUUID' };

	const mockWhoDislikedRepo = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		destroy: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				WhoDislikedService,
				{
					provide: getModelToken(WhoDislikedModel),
					useValue: mockWhoDislikedRepo
				}
			]
		}).compile();

		whoDislikedService = moduleRef.get<WhoDislikedService>(WhoDislikedService);
		whoDislikedRepository = moduleRef.get<WhoDislikedModel>(getModelToken(WhoDislikedModel));
	});

	it('should be defined', () => {
		expect(whoDislikedService).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users, who liked post', async () => {
			jest.spyOn(whoDislikedRepository, 'findAll').mockReturnValueOnce([testModel as WhoLikedModel]);
			expect(await whoDislikedService.findAll('postUUID')).toEqual([testModel as WhoLikedModel]);
		});
	});

	describe('findOneByUserUUID', () => {
		it('should return one user who liked post', async () => {
			jest.spyOn(whoDislikedRepository, 'findOne').mockReturnValueOnce(testModel as WhoLikedModel);
			expect(await whoDislikedService.findOneByUserUUID('userUUID', 'postUUID')).toEqual(testModel as WhoLikedModel);
		});
	});

	describe('makeDislike', () => {
		it('should be called', async () => {
			jest.spyOn(whoDislikedRepository, 'create').mockReturnValueOnce(testModel as WhoLikedModel);
			await whoDislikedService.makeDislike('userUUID', 'postUUID');
			expect(whoDislikedRepository.create).toBeCalled();
		});
	});

	describe('rollbackDislike', () => {
		it('should be called', async () => {
			jest.spyOn(whoDislikedRepository, 'destroy').mockReturnValueOnce(null);
			await whoDislikedService.rollbackDislike('userUUID', 'postUUID');
			expect(whoDislikedRepository.destroy).toBeCalled();
		});
	});
});
