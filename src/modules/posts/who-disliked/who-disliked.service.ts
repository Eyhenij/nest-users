import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhoDislikedModel } from './who-disliked.model';

@Injectable()
export class WhoDislikedService {
	constructor(
		@InjectModel(WhoDislikedModel)
		private readonly _whoDislikedRepository: typeof WhoDislikedModel
	) {}

	public async findAll(postUUID: string): Promise<WhoDislikedModel[]> {
		return await this._whoDislikedRepository.findAll<WhoDislikedModel>({
			where: { postUUID },
			attributes: { exclude: ['postUUID', 'id'] }
		});
	}

	public async findOneByUserUUID(userUUID: string, postUUID: string): Promise<WhoDislikedModel> {
		return await this._whoDislikedRepository.findOne<WhoDislikedModel>({
			where: { userUUID, postUUID },
			attributes: { exclude: ['postUUID', 'id'] }
		});
	}

	public async makeDislike(userUUID: string, postUUID: string): Promise<void> {
		await this._whoDislikedRepository.create<WhoDislikedModel>({ postUUID, userUUID });
	}

	public async rollbackDislike(userUUID: string, postUUID: string): Promise<void> {
		await this._whoDislikedRepository.destroy<WhoDislikedModel>({ where: { postUUID, userUUID } });
	}
}
