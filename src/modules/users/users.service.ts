import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { UpdateUserDto } from './updateUser.dto';
import { CreateUserDto } from './createUser.dto';
import { IResposeMessage } from '../../interfaces/IResposeMessage';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private readonly usersRepository: typeof User,
		private readonly sequelize: Sequelize
	) {}

	public async findAll(): Promise<User[] | IResposeMessage> {
		try {
			return await this.usersRepository.findAll<User>({ attributes: { exclude: ['password'] } });
		} catch (error) {
			return { message: error.message };
		}
	}

	public async findOne(userId: string): Promise<User | IResposeMessage> {
		try {
			const user = await this.usersRepository.findOne<User>({
				where: { id: userId },
				attributes: { exclude: ['password'] }
			});
			if (!user) {
				throw new Error('userId not exist');
			}
			return user;
		} catch (error) {
			return { message: error.message };
		}
	}

	public async create(userData: CreateUserDto): Promise<IResposeMessage> {
		try {
			return await this.sequelize.transaction(async () => {
				await this.usersRepository.create<User>({ ...userData });
				return { message: 'create:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async updateAll(newArray): Promise<IResposeMessage> {
		try {
			return await this.sequelize.transaction(async (transaction: Transaction) => {
				await this.usersRepository.truncate({ cascade: true, transaction });
				await this.usersRepository.bulkCreate(newArray);
				return { message: 'updateAll:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async updateOne(updateUserData: UpdateUserDto, userId: string): Promise<IResposeMessage> {
		try {
			return await this.sequelize.transaction(async (transaction: Transaction) => {
				const user = await this.usersRepository.findOne<User>({ where: { id: userId } });
				if (!user) {
					throw new Error('userId not exist');
				}
				await user.update({ ...updateUserData }, { transaction });
				return { message: 'updateOne:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async remove(userId: string): Promise<IResposeMessage> {
		try {
			return await this.sequelize.transaction(async (transaction: Transaction) => {
				const user = await this.usersRepository.findOne<User>({ where: { id: userId } });
				if (!user) {
					throw new Error('userId not exist');
				}
				await user.destroy({ transaction });
				return { message: 'remove:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}
}
