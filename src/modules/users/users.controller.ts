import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get, HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Put,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResponseMessageDto } from '../../interfaces/response.dtos';
import { DoesUserExistGuard } from '../../guards/does-user-exist.guard';
import { AuthTokenGuard } from '../../guards/auth.token.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAllUsersDto } from './dto/updateAllUsersDto';
import { RoleGuard } from '../../guards/role.guard';
import { DoesLoginExistGuard } from '../../guards/does-login-exist.guard';

@Controller('api/users')
@ApiTags('user-accounts')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class UsersController {
	constructor(private readonly _usersService: UsersService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get all user-accounts' })
	@ApiResponse({ status: 200, description: 'get array of user-accounts:success', type: [User] })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	public async findAll(): Promise<User[] | ResponseMessageDto> {
		return await this._usersService.findAll();
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(DoesUserExistGuard)
	@ApiOperation({ description: 'get one user-account by id' })
	@ApiResponse({ status: 200, description: 'get one user-account:success', type: User })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'userId not exist', type: NotFoundException })
	public async findOne(@Param('id') userId: string): Promise<User | ResponseMessageDto> {
		return await this._usersService.findOneById(userId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RoleGuard)
	@UseGuards(DoesLoginExistGuard)
	@ApiOperation({ description: 'create new user-account' })
	@ApiResponse({ status: 201, description: 'create user-account:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiBody({ type: CreateUserDto })
	public async create(@Body() createUserData: CreateUserDto): Promise<ResponseMessageDto> {
		return await this._usersService.create(createUserData);
	}

	@Put()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RoleGuard)
	@ApiOperation({ description: 'update all user-accounts' })
	@ApiResponse({ status: 201, description: 'update all user-accounts:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 403, description: 'you have no rights', type: ForbiddenException })
	@ApiBody({ type: UpdateAllUsersDto })
	public async updateAll(@Body() updateData: UpdateAllUsersDto): Promise<ResponseMessageDto> {
		return await this._usersService.updateAll(updateData);
	}

	@Put(':id')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RoleGuard)
	@UseGuards(DoesUserExistGuard)
	@ApiOperation({ description: 'update one user-account by id' })
	@ApiResponse({ status: 201, description: 'update user-account:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 403, description: 'you have no rights', type: ForbiddenException })
	@ApiResponse({ status: 404, description: 'userId not exist', type: NotFoundException })
	@ApiBody({ type: CreateUserDto })
	public async updateOne(
		@Body() updateUserData: UpdateUserDto,
		@Param('id') userId: string
	): Promise<ResponseMessageDto> {
		return await this._usersService.updateOne(updateUserData, userId);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(RoleGuard)
	@UseGuards(DoesUserExistGuard)
	@ApiOperation({ description: 'delete user-account by id' })
	@ApiResponse({ status: 200, description: 'delete user-account:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 403, description: 'you have no rights', type: ForbiddenException })
	@ApiResponse({ status: 404, description: 'userId not exist', type: NotFoundException })
	public async remove(@Param('id') userId: string): Promise<ResponseMessageDto> {
		return await this._usersService.remove(userId);
	}
}
