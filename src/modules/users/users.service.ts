import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { IResponseMessage } from '../../interfaces/response.interfaces';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private readonly _usersRepository: typeof User,
		private readonly _sequelize: Sequelize
	) {}

	public async checkUserExist(userId: string): Promise<boolean> {
		const user = await this._usersRepository.findOne<User>({ where: { id: userId } });
		return !!user;
	}

	public async findAll(): Promise<User[] | IResponseMessage> {
		try {
			return await this._usersRepository.findAll<User>({ attributes: { exclude: ['password'] } });
		} catch (error) {
			return { message: error.message };
		}
	}

	public async findOneById(userId: string): Promise<User | IResponseMessage> {
		try {
			return await this._usersRepository.findOne<User>({
				where: { id: userId },
				attributes: { exclude: ['password'] }
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async create(userData: CreateUserDto): Promise<IResponseMessage> {
		try {
			return await this._sequelize.transaction(async () => {
				await this._usersRepository.create<User>({ ...userData });
				return { message: 'create:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async updateAll(newArray): Promise<IResponseMessage> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.truncate({ cascade: true, transaction });
				await this._usersRepository.bulkCreate(newArray);
				return { message: 'updateAll:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async updateOne(updateUserData: UpdateUserDto, userId: string): Promise<IResponseMessage> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.update<User>({ ...updateUserData }, { where: { id: userId }, transaction });
				return { message: 'updateOne:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}

	public async remove(userId: string): Promise<IResponseMessage> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.destroy<User>({ where: { id: userId }, transaction });
				return { message: 'remove:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}
}
