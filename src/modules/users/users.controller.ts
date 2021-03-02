import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './user.model';
import { UpdateUserDto } from './updateUser.dto';
import { CreateUserDto } from './createUser.dto';
import { IResponseMessage } from '../../interfaces/response.interfaces';
import { DoesUserExistGuard } from '../../guards/does-user-exist.guard';
import { TokenGuard } from '../../guards/token.guard';

@Controller('api/users')
@UseGuards(TokenGuard)
export class UsersController {
	constructor(private readonly _usersService: UsersService) {}

	@Get()
	public async findAll(@Res() res: Response): Promise<Response> {
		const result: User[] | IResponseMessage = await this._usersService.findAll();
		return res.status(HttpStatus.OK).json(result);
	}

	@Get(':id')
	@UseGuards(DoesUserExistGuard)
	public async findOne(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const result: User | IResponseMessage = await this._usersService.findOneById(userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post()
	public async create(@Res() res: Response, @Body() createUserData: CreateUserDto): Promise<Response> {
		const result: IResponseMessage = await this._usersService.create(createUserData);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Put()
	public async updateAll(@Res() res: Response, @Body() updateData): Promise<Response> {
		const result: IResponseMessage = await this._usersService.updateAll(updateData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Put(':id')
	@UseGuards(DoesUserExistGuard)
	public async updateOne(@Res() res: Response, @Body() updateUserData: UpdateUserDto, @Param('id') userId: string): Promise<Response> {
		const result: IResponseMessage = await this._usersService.updateOne(updateUserData, userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Delete(':id')
	@UseGuards(DoesUserExistGuard)
	public async remove(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const result: IResponseMessage = await this._usersService.remove(userId);
		return res.status(HttpStatus.OK).json(result);
	}
}
