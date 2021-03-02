import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IAuthResponseMessage, IResponseMessage } from '../../interfaces/response.interfaces';
import { CreateUserDto } from '../users/createUser.dto';
import { AuthDto } from './auth.dto';
import { DoesLoginExistGuard } from '../../guards/does-login-exist.guard';

@Controller('api')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('login')
	public async signIn(@Res() res: Response, @Body() authData: AuthDto): Promise<Response> {
		const result: IAuthResponseMessage | IResponseMessage = await this._authService.signIn(authData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post('register')
	@UseGuards(DoesLoginExistGuard)
	async signUp(@Res() res: Response, @Body() user: CreateUserDto): Promise<Response> {
		const result: IAuthResponseMessage | IResponseMessage = await this._authService.signUp(user);
		return res.status(HttpStatus.OK).json(result);
	}
}
