import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IAuthResponseMessage, IResponseMessage } from '../../interfaces/response.interfaces';
import { CreateUserDto } from '../users/createUser.dto';
import { AuthDto } from './auth.dto';
import { IsUserGuard } from '../../guards/isUser.guard';

@Controller('api')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	public async authorize(@Res() res: Response, @Body() authData: AuthDto): Promise<Response> {
		const result: IAuthResponseMessage | IResponseMessage = await this.authService.authorize(authData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post('register')
	@UseGuards(IsUserGuard)
	async signUp(@Res() res: Response, @Body() user: CreateUserDto): Promise<Response> {
		const result: IAuthResponseMessage | IResponseMessage = await this.authService.register(user);
		return res.status(HttpStatus.OK).json(result);
	}
}
