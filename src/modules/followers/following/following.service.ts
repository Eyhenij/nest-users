import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Following } from './following.model';

@Injectable()
export class FollowingService {
	constructor(
		@InjectModel(Following)
		private readonly _followingRepository: typeof Following
	) {}

	public async findAllFollowing(userUUID: string): Promise<Following[]> {
		return await this._followingRepository.findAll<Following>({ where: { userUUID } });
	}
}
