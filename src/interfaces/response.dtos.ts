import { User } from '../modules/users/user.model';
import { Contains, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseMessageDto {
	@ApiProperty({
		required: true,
		type: 'string'
	})
	@IsNotEmpty()
	@IsString()
	message: string;

	@ApiProperty({
		required: true,
		type: 'boolean'
	})
	@IsNotEmpty()
	@IsBoolean()
	success: boolean;
}

export class AuthResponseMessageDto {
	@ApiProperty({
		required: true,
		type: User
	})
	@IsNotEmpty()
	profile: User;

	@ApiProperty({
		required: true,
		type: 'string'
	})
	@Contains('Bearer')
	@IsString()
	token: string;
}
