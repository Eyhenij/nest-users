import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResponseMessageDto } from '../../interfaces/response.dtos';
import { UpdateAllUsersDto } from './dto/updateAllUsersDto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private readonly _usersRepository: typeof User
	) {}

	public async checkUserExist(userId: string): Promise<boolean> {
		const user = await this._usersRepository.findOne<User>({ where: { id: userId } });
		return !!user;
	}

	public async findAll(): Promise<User[]> {
		try {
			return await this._usersRepository.findAll<User>({ attributes: { exclude: ['password'] } });
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	public async findOneById(userId: string): Promise<User> {
		try {
			return await this._usersRepository.findOne<User>({
				where: { id: userId },
				attributes: { exclude: ['password'] }
			});
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	public async findOneByLogin(login: string): Promise<User> {
		try {
			return await this._usersRepository.findOne<User>({ where: { login } });
		} catch (error) {
			throw new NotFoundException('login not found');
		}
	}

	public async create(userData: CreateUserDto): Promise<ResponseMessageDto> {
		try {
			await this._usersRepository.create<User>({ ...userData });
			return { message: 'create user-account:success', success: true };
		} catch (error) {
			throw new BadRequestException('invalid user data');
		}
	}

	public async updateAll(newArray: UpdateAllUsersDto): Promise<ResponseMessageDto> {
		try {
			await this._usersRepository.truncate({ cascade: true });
			await this._usersRepository.bulkCreate(newArray.arr);
			return { message: 'update all user-accounts:success', success: true };
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	public async updateOne(updateUserData: UpdateUserDto, userId: string | number): Promise<ResponseMessageDto> {
		try {
			await this._usersRepository.update<User>({ ...updateUserData }, { where: { id: userId } });
			return { message: 'update user-account:success', success: true };
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	public async remove(userId: string): Promise<ResponseMessageDto> {
		try {
			await this._usersRepository.destroy<User>({ where: { id: userId } });
			return { message: 'delete user-account:success', success: true };
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}
}
