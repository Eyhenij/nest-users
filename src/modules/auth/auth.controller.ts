import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthResponseMessageDto, ResponseMessageDto } from '../../interfaces/response.dtos';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthDto } from './dto/auth.dto';
import { DoesLoginExistGuard } from '../../guards/does-login-exist.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api')
@ApiTags('authorization')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('login')
	@ApiOperation({ description: 'sign in account' })
	@ApiResponse({ status: 200, description: 'login:success' })
	@ApiResponse({ status: 401, description: 'unauthorized' })
	@ApiBody({ type: [AuthDto] })
	public async signIn(@Res() res: Response, @Body() authData: AuthDto): Promise<Response> {
		const result: AuthResponseMessageDto | ResponseMessageDto = await this._authService.signIn(authData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post('register')
	@UseGuards(DoesLoginExistGuard)
	@ApiOperation({ description: 'create new account' })
	@ApiResponse({ status: 201, description: 'register:success' })
	@ApiResponse({ status: 401, description: 'unauthorized' })
	@ApiBody({ type: [CreateUserDto] })
	async signUp(@Res() res: Response, @Body() user: CreateUserDto): Promise<Response> {
		const result: ResponseMessageDto = await this._authService.signUp(user);
		return res.status(HttpStatus.CREATED).json(result);
	}
}
