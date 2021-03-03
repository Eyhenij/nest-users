import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { IAuthResponseMessage, IResponseMessage } from '../../interfaces/response.interfaces';
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

	public async signIn(authData: AuthDto): Promise<IAuthResponseMessage | IResponseMessage> {
		const user = await this._usersRepository.findOne({ where: { login: authData.login } });
		if (!user) {
			throw new NotFoundException('user not found');
		}
		if (await bcrypt.compare(authData.password, user.password)) {
			const token = await this._jwtService.signAsync({ ...authData, type: 'access' });

			// in order to don't send the user's password to the client - create new user instance without password-attribute
			const cleanUser = await this._usersRepository.findOne({
				where: { login: authData.login },
				attributes: { exclude: ['password'] }
			});
			return { profile: cleanUser, token: `Bearer ${token}` };
		}
		throw new Error('You have entered incorrect password');
	}

	public async signUp(userData: CreateUserDto): Promise<IResponseMessage> {
		try {
			return await this._sequelize.transaction(async (transaction: Transaction) => {
				await this._usersRepository.create<User>({ ...userData }, { transaction });
				return { message: 'create:success' };
			});
		} catch (error) {
			return { message: error.message };
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
