import {
	Headers,
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	HttpStatus,
	NotFoundException,
	Post,
	Res,
	UseGuards,
	UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthResponseMessageDto, ResponseMessageDto } from '../../interfaces/response.dtos';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthDto } from './dto/auth.dto';
import { DoesLoginExistGuard } from '../../guards/does-login-exist.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from '../../guards/auth.token.guard';
import { IncomingHttpHeaders } from 'http';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('api')
@ApiTags('authorization')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('login')
	@ApiOperation({ description: 'sign in account' })
	@ApiResponse({ status: 200, description: 'login:success' })
	@ApiResponse({ status: 403, description: 'you have entered incorrect password', type: ForbiddenException })
	@ApiResponse({ status: 404, description: 'user not found', type: NotFoundException })
	@ApiBody({ type: AuthDto })
	public async signIn(@Res() res: Response, @Body() authData: AuthDto): Promise<Response> {
		const result: AuthResponseMessageDto | ResponseMessageDto = await this._authService.signIn(authData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post('register')
	@UseGuards(DoesLoginExistGuard)
	@ApiOperation({ description: 'create new account' })
	@ApiResponse({ status: 201, description: 'register:success' })
	@ApiResponse({ status: 400, description: 'Bad Request', type: BadRequestException })
	@ApiResponse({ status: 403, description: 'this login already exist', type: ForbiddenException })
	@ApiBody({ type: CreateUserDto })
	async signUp(@Res() res: Response, @Body() user: CreateUserDto): Promise<Response> {
		const result: ResponseMessageDto = await this._authService.signUp(user);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Post('password')
	@UseGuards(AuthTokenGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'change user password' })
	@ApiResponse({ status: 201, description: 'change password:success' })
	@ApiResponse({ status: 400, description: 'Bad Request', type: BadRequestException })
	@ApiResponse({ status: 401, description: 'invalid authorization headers', type: UnauthorizedException })
	@ApiBody({ type: NewPasswordDto })
	async changePassword(
		@Res() res: Response,
		@Headers() headers: IncomingHttpHeaders,
		@Body() newPassword: NewPasswordDto
	): Promise<Response> {
		const authHeaders = headers['authorization'];
		const result: ResponseMessageDto = await this._authService.changePassword(authHeaders, newPassword);
		return res.status(HttpStatus.CREATED).json(result);
	}
}
