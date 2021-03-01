import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { IAuthResponseMessage, IResponseMessage } from '../../interfaces/response.interfaces';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/createUser.dto';
import { Sequelize } from 'sequelize-typescript';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User)
		private readonly _usersRepository: typeof User,
		private readonly _sequelize: Sequelize,
		private readonly _jwtService: JwtService
	) {}

	private async _generateToken(userData, type) {
		return await this._jwtService.signAsync({ ...userData, type: type });
	}

	private async _checkPassword(loginData: AuthDto, user: User) {
		if (await bcrypt.compare(loginData.password, user.password)) {
			return await this._generateToken(user, 'access');
		}
		throw new Error('You have entered incorrect password');
	}

	public async authorize(authData: AuthDto): Promise<IAuthResponseMessage | IResponseMessage> {
		try {
			const user = await User.findOne({ where: { login: authData.login } });
			if (!user) {
				throw new NotFoundException('user not found');
			}
			const token = await this._checkPassword(authData, user);
			return {
				profile: user,
				token: `Bearer ${token}`
			};
		} catch (error) {
			return { message: error.message };
		}
	}

	public async register(userData: CreateUserDto): Promise<IResponseMessage> {
		try {
			return await this._sequelize.transaction(async () => {
				await this._usersRepository.create<User>({ ...userData });
				return { message: 'create:success' };
			});
		} catch (error) {
			return { message: error.message };
		}
	}
}
