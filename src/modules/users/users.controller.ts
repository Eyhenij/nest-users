import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserForPost } from '../../interfaces/user.interfaces';
import { Response } from 'express';
import { User } from '../../database/models/user.model';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	public async findAll(@Res() res: Response): Promise<Response> {
		const users: User[] = await this.usersService.findAll();
		return res.status(HttpStatus.OK).json(users);
	}

	@Get(':id')
	public async findOne(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		const user: User = await this.usersService.findOne(userId);
		return res.status(HttpStatus.OK).json(user);
	}

	@Post()
	public async create(@Res() res: Response, @Body() createUserData: IUserForPost): Promise<Response> {
		// if (!req.body || (req.body && Object.keys(req.body).length === 0)) {
		//     throw new Error('no newUserData in the request');
		// }
		await this.usersService.create(createUserData);
		return res
			.status(HttpStatus.CREATED)
			.json({ message: `You just create new User: login - ${createUserData.login}, email - ${createUserData.email}.` });
	}

	@Put(':id')
	public async update(@Res() res: Response, @Body() updateUserData, @Param('id') userId: string): Promise<Response> {
		await this.usersService.updateOne(updateUserData, userId);
		return res.status(HttpStatus.OK).json({ message: 'userData have been updated' });
	}

	@Delete(':id')
	public async remove(@Res() res: Response, @Param('id') userId: string): Promise<Response> {
		await this.usersService.remove(userId);
		return res.status(HttpStatus.OK).json({ message: 'user have been deleted' });
	}
}
