import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhoLikedModel } from './who-liked.model';

@Injectable()
export class WhoLikedService {
	constructor(
		@InjectModel(WhoLikedModel)
		private readonly _whoLikedRepository: typeof WhoLikedModel
	) {}

	public async findAll(postUUID: string): Promise<WhoLikedModel[]> {
		return await this._whoLikedRepository.findAll<WhoLikedModel>({
			where: { postUUID },
			attributes: { exclude: ['postUUID', 'id'] }
		});
	}

	public async findOneByUserUUID(userUUID: string, postUUID: string): Promise<WhoLikedModel> {
		return await this._whoLikedRepository.findOne<WhoLikedModel>({
			where: { userUUID, postUUID },
			attributes: { exclude: ['id'] }
		});
	}

	public async makeLike(userUUID: string, postUUID: string): Promise<void> {
		await this._whoLikedRepository.create<WhoLikedModel>({ postUUID, userUUID });
	}

	public async rollbackLike(userUUID: string, postUUID: string): Promise<void> {
		await this._whoLikedRepository.destroy<WhoLikedModel>({ where: { postUUID, userUUID } });
	}
}
