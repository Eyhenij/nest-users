import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Put,
	Res,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResponseMessageDto } from '../../interfaces/response.dtos';
import { DoesUserExistGuard } from '../../guards/does-user-exist.guard';
import { AuthTokenGuard } from '../../guards/auth.token.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAllUsersDto } from './dto/updateAllUsersDto';
import { RoleGuard } from '../../guards/role.guard';

@Controller('api/users')
@ApiTags('user-accounts')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class UsersController {
	constructor(private readonly _usersService: UsersService) {}

	@Get()
	@ApiOperation({ description: 'get all user-accounts' })
	@ApiResponse({ status: 200, description: 'get array of user-accounts:success', type: [User] })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	public async findAll(@Res() res: Response): Promise<Response> {
		const result: User[] | ResponseMessageDto = await this._usersService.findAll();
		return res.status(HttpStatus.OK).json(result);
	}

	@Get(':id')
	@UseGuards(DoesUserExistGuard)
	@ApiOperation({ description: 'get one user-account by id' })
	@ApiResponse({ status: 200, description: 'get one user-account:success', type: User })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'userId not exist', type: NotFoundException })
	public async findOne(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const result: User | ResponseMessageDto = await this._usersService.findOneById(userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post()
	@ApiOperation({ description: 'create new user-account' })
	@ApiResponse({ status: 201, description: 'create user-account:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiBody({ type: CreateUserDto })
	public async create(@Res() res: Response, @Body() createUserData: CreateUserDto): Promise<Response> {
		const result: ResponseMessageDto = await this._usersService.create(createUserData);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Put()
	@UseGuards(RoleGuard)
	@ApiOperation({ description: 'update all user-accounts' })
	@ApiResponse({ status: 201, description: 'update all user-accounts:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 403, description: 'you have no rights', type: ForbiddenException })
	@ApiBody({ type: UpdateAllUsersDto })
	public async updateAll(@Res() res: Response, @Body() updateData: UpdateAllUsersDto): Promise<Response> {
		const result: ResponseMessageDto = await this._usersService.updateAll(updateData);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Put(':id')
	@UseGuards(RoleGuard)
	@UseGuards(DoesUserExistGuard)
	@ApiOperation({ description: 'update one user-account by id' })
	@ApiResponse({ status: 201, description: 'update user-account:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 403, description: 'you have no rights', type: ForbiddenException })
	@ApiResponse({ status: 404, description: 'userId not exist', type: NotFoundException })
	@ApiBody({ type: CreateUserDto })
	public async updateOne(@Res() res: Response, @Body() updateUserData: UpdateUserDto, @Param('id') userId: string): Promise<Response> {
		const result: ResponseMessageDto = await this._usersService.updateOne(updateUserData, userId);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Delete(':id')
	@UseGuards(RoleGuard)
	@UseGuards(DoesUserExistGuard)
	@ApiOperation({ description: 'delete user-account by id' })
	@ApiResponse({ status: 200, description: 'delete user-account:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 403, description: 'you have no rights', type: ForbiddenException })
	@ApiResponse({ status: 404, description: 'userId not exist', type: NotFoundException })
	public async remove(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const result: ResponseMessageDto = await this._usersService.remove(userId);
		return res.status(HttpStatus.OK).json(result);
	}
}
