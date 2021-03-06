import {
	Headers,
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	HttpStatus,
	NotFoundException,
	Post,
	UseGuards,
	UnauthorizedException,
	HttpCode
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'sign in account' })
	@ApiResponse({ status: 200, description: 'login:success' })
	@ApiResponse({ status: 403, description: 'you have entered incorrect password', type: ForbiddenException })
	@ApiResponse({ status: 404, description: 'user not found', type: NotFoundException })
	@ApiBody({ type: AuthDto })
	public async signIn(@Body() authData: AuthDto): Promise<AuthResponseMessageDto | ResponseMessageDto> {
		return await this._authService.signIn(authData);
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(DoesLoginExistGuard)
	@ApiOperation({ description: 'create new account' })
	@ApiResponse({ status: 201, description: 'register:success' })
	@ApiResponse({ status: 400, description: 'Bad Request', type: BadRequestException })
	@ApiResponse({ status: 403, description: 'this login already exist', type: ForbiddenException })
	@ApiBody({ type: CreateUserDto })
	async signUp(@Body() user: CreateUserDto): Promise<ResponseMessageDto> {
		return await this._authService.signUp(user);
	}

	@Post('forgot_password')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthTokenGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'change user password' })
	@ApiResponse({ status: 201, description: 'change password:success' })
	@ApiResponse({ status: 400, description: 'Bad Request', type: BadRequestException })
	@ApiResponse({ status: 401, description: 'invalid authorization headers', type: UnauthorizedException })
	@ApiBody({ type: NewPasswordDto })
	async changePassword(@Headers() headers: IncomingHttpHeaders, @Body() newPassword: NewPasswordDto): Promise<ResponseMessageDto> {
		return await this._authService.changePassword(headers['authorization'], newPassword);
	}
}
