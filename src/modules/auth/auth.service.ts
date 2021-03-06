import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.model';
import { AuthResponseMessageDto, ResponseMessageDto } from '../../interfaces/response.dtos';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class AuthService {
	constructor(private readonly _jwtService: JwtService, private readonly _usersService: UsersService) {}

	public async signIn(authData: AuthDto): Promise<AuthResponseMessageDto | ResponseMessageDto> {
		const user = await this.findLogin(authData.login);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		if (await bcrypt.compare(authData.password, user.password)) {
			const access_token = await this._jwtService.signAsync({
				login: user.login,
				role: user.role,
				type: 'access'
			});
			const { password, ...cleanUser } = user['dataValues'];
			return { profile: cleanUser, token: `Bearer ${access_token}` };
		}
		throw new ForbiddenException('you have entered incorrect password');
	}

	public async signUp(userData: CreateUserDto): Promise<ResponseMessageDto> {
		return await this._usersService.create(userData);
	}

	public async changePassword(authHeaders: string, newPassword: NewPasswordDto): Promise<ResponseMessageDto> {
		const user = await this.verifyToken(authHeaders);
		return await this._usersService.updateOne(newPassword, user.id);
	}

	public async findLogin(login: string): Promise<User> {
		return await this._usersService.findOneByLogin(login);
	}

	public async verifyToken(authHeaders: string): Promise<User> {
		try {
			const [strategy, token] = authHeaders.split(' ');
			const result = await this._jwtService.verify(token);
			if (result) {
				return await this.findLogin(result.login);
			}
		} catch (error) {
			throw new UnauthorizedException('invalid authorization headers');
		}
	}

	public async verifyUserRole(authHeaders: string): Promise<string> {
		const user = await this.verifyToken(authHeaders);
		return user.role;
	}
}
