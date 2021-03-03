import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResponseMessageDto } from '../../interfaces/response.dtos';

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

	public async findAll(): Promise<User[] | ResponseMessageDto> {
		try {
			return await this._usersRepository.findAll<User>({ attributes: { exclude: ['password'] } });
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async findOneById(userId: string): Promise<User | ResponseMessageDto> {
		try {
			return await this._usersRepository.findOne<User>({
				where: { id: userId },
				attributes: { exclude: ['password'] }
			});
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async create(userData: CreateUserDto): Promise<ResponseMessageDto> {
		try {
			return await this._sequelize.transaction(async () => {
				await this._usersRepository.create<User>({ ...userData });
				return { message: 'create user-account:success', success: true };
			});
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async updateAll(newArray): Promise<ResponseMessageDto> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.truncate({ cascade: true, transaction });
				await this._usersRepository.bulkCreate(newArray);
				return { message: 'update all user-accounts:success', success: true };
			});
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async updateOne(updateUserData: UpdateUserDto, userId: string): Promise<ResponseMessageDto> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.update<User>({ ...updateUserData }, { where: { id: userId }, transaction });
				return { message: 'update user-account:success', success: true };
			});
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async remove(userId: string): Promise<ResponseMessageDto> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.destroy<User>({ where: { id: userId }, transaction });
				return { message: 'delete user-account:success', success: true };
			});
		} catch (error) {
			return { message: error.message, success: false };
		}
	}
}
