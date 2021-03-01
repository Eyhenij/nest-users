import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './user.model';
import { UpdateUserDto } from './updateUser.dto';
import { CreateUserDto } from './createUser.dto';
import { IResponseMessage } from '../../interfaces/response.interfaces';
import { IsNotUserGuard } from '../../guards/isNotUser.guard';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards()
	public async findAll(@Res() res: Response): Promise<Response> {
		const result: User[] | IResponseMessage = await this.usersService.findAll();
		return res.status(HttpStatus.OK).json(result);
	}

	@Get(':id')
	@UseGuards(IsNotUserGuard)
	public async findOne(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const result: User | IResponseMessage = await this.usersService.findOne(userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Post()
	@UseGuards()
	public async create(@Res() res: Response, @Body() createUserData: CreateUserDto): Promise<Response> {
		const result: IResponseMessage = await this.usersService.create(createUserData);
		return res.status(HttpStatus.CREATED).json(result);
	}

	@Put()
	@UseGuards()
	public async updateAll(@Res() res: Response, @Body() updateData): Promise<Response> {
		const result: IResponseMessage = await this.usersService.updateAll(updateData);
		return res.status(HttpStatus.OK).json(result);
	}

	@Put(':id')
	@UseGuards(IsNotUserGuard)
	public async updateOne(@Res() res: Response, @Body() updateUserData: UpdateUserDto, @Param('id') userId: string): Promise<Response> {
		const result: IResponseMessage = await this.usersService.updateOne(updateUserData, userId);
		return res.status(HttpStatus.OK).json(result);
	}

	@Delete(':id')
	@UseGuards(IsNotUserGuard)
	public async remove(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const result: IResponseMessage = await this.usersService.remove(userId);
		return res.status(HttpStatus.OK).json(result);
	}
}
