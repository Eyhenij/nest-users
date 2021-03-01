import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './user.model';
import { UpdateUserDto } from './updateUser.dto';
import { CreateUserDto } from './createUser.dto';
import { IResposeMessage } from '../../interfaces/IResposeMessage';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	public async findAll(@Res() res: Response): Promise<Response> {
		const result: User[] | IResposeMessage = await this.usersService.findAll();
		return res.status(HttpStatus.OK).json(result);
	}

	@Get(':id')
	public async findOne(
		@Res() res: Response,
		@Param('id') userId: string
	): Promise<Response> {
		const result: User | IResposeMessage = await this.usersService.findOne(userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post()
	public async create(
		@Res() res: Response,
		@Body() createUserData: CreateUserDto
	): Promise<Response> {
		const result: IResposeMessage = await this.usersService.create(createUserData);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Put()
	public async updateAll(
		@Res() res: Response,
		@Body() updateData
	): Promise<Response> {
		const result: IResposeMessage = await this.usersService.updateAll(updateData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Put(':id')
	public async updateOne(
		@Res() res: Response,
		@Body() updateUserData: UpdateUserDto,
		@Param('id') userId: string
	): Promise<Response> {
		const result: IResposeMessage = await this.usersService.updateOne(updateUserData, userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Delete(':id')
	public async remove(
		@Res() res: Response,
		@Param('id') userId: string
	): Promise<Response> {
		const result: IResposeMessage = await this.usersService.remove(userId);
		return res.status(HttpStatus.OK).json(result);
	}
}
