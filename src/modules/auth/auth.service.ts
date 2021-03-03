import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { AuthResponseMessageDto, ResponseMessageDto } from '../../interfaces/response.dtos';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { Sequelize } from 'sequelize-typescript';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from 'sequelize';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User)
		private readonly _usersRepository: typeof User,
		private readonly _sequelize: Sequelize,
		private readonly _jwtService: JwtService
	) {}

	public async checkLoginExist(login: string): Promise<boolean> {
		const user = await this._usersRepository.findOne<User>({ where: { login: login } });
		return !!user;
	}

	public async signIn(authData: AuthDto): Promise<AuthResponseMessageDto | ResponseMessageDto> {
		try {
			const user = await this._usersRepository.findOne({ where: { login: authData.login } });
			if (!user) {
				return { message: 'user not found', success: false };
			}
			if (await bcrypt.compare(authData.password, user.password)) {
				const access_token = await this._jwtService.signAsync({ ...authData, type: 'access' });
				const { password, ...cleanUser } = user['dataValues'];
				return { profile: cleanUser, token: `Bearer ${access_token}` };
			}
			return { message: 'You have entered incorrect password', success: false };
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async signUp(userData: CreateUserDto): Promise<ResponseMessageDto> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.create<User>({ ...userData }, { transaction });
				return { message: 'create:success', success: true };
			});
		} catch (error) {
			return { message: error.message, success: false };
		}
	}

	public async verifyToken(authHeaders): Promise<boolean> {
		try {
			const [strategy, token] = authHeaders.split(' ');
			const result = this._jwtService.verify(token);
			return await this.checkLoginExist(result.login);
		} catch (error) {
			throw new UnauthorizedException('Invalid authorization headers');
		}
	}
}
