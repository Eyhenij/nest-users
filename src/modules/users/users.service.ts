import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/user.model';
import { IUserForPost } from '../../interfaces/user.interfaces';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private usersRepository: typeof User,
		private readonly sequelize: Sequelize
	) {}

	public async findAll(): Promise<User[]> {
		return await this.usersRepository.findAll<User>();
	}

	public async findOne(userId: string): Promise<User> {
		return await this.usersRepository.findOne<User>({ where: { id: userId } });
	}

	public async create(userData): Promise<User> {
		// try {
		// 	return await this.sequelize.transaction(async () => {
		// 		return await this.usersRepository.create<User>({ ...userData });
		// 	});
		// } catch (err) {}
		return await this.usersRepository.create<User>(...userData);
	}

	public async updateAll(newArray): Promise<void> {
		try {
			await this.sequelize.transaction(async () => {
				await this.usersRepository.destroy({ where: {}, truncate: true });
				await this.usersRepository.bulkCreate(newArray);
			});
		} catch (err) {}
	}

	public async updateOne(newUserData: IUserForPost, userId: string): Promise<void> {
		try {
			await this.sequelize.transaction(async (transaction: Transaction) => {
				await this.usersRepository.update(
					{ ...newUserData },
					{
						where: { id: userId },
						transaction
					}
				);
			});
		} catch (err) {}
	}

	public async remove(userId: string): Promise<void> {
		try {
			await this.sequelize.transaction(async (transaction: Transaction) => {
				await this.usersRepository.destroy({
					where: { id: userId },
					transaction
				});
			});
		} catch (err) {}
	}
}
