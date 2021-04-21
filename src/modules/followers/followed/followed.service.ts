import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseMessageDto } from '../../../common/response.dtos';
import { Followed } from './followed.model';

@Injectable()
export class FollowedService {
	constructor(
		@InjectModel(Followed)
		private readonly _followedRepository: typeof Followed
	) {}

	public async findAllFollowed(userUUID: string): Promise<Followed[]> {
		return await this._followedRepository.findAll<Followed>({ where: { userUUID } });
	}

	public async follow(followedUUID): Promise<ResponseMessageDto> {
		await this._followedRepository.create<Followed>({ followedUUID });
		return { message: 'follow:success', success: true };
	}

	public async unfollow(followedUUID: string): Promise<ResponseMessageDto> {
		await this._followedRepository.destroy<Followed>({ where: { followedUUID } });
		return { message: 'unfollow:success', success: true };
	}
}
