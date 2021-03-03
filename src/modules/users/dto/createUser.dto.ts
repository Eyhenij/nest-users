import { Contains, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({
		required: true,
		type: 'string'
	})
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@ApiProperty({
		required: true,
		type: 'string',
		minLength: 3,
		example: '@login',
		uniqueItems: true
	})
	@IsNotEmpty()
	@IsString()
	@Contains('@')
	@MinLength(3)
	readonly login: string;

	@ApiProperty({
		required: true,
		type: 'email',
		example: 'example@email.com',
		uniqueItems: true
	})
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@ApiProperty({
		required: true,
		type: 'string',
		minLength: 8
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	readonly password: string;

	@ApiProperty({
		required: false,
		type: 'enum',
		example: 'user',
		enum: ['user', 'admin', 'guest']
	})
	@IsString()
	@IsEnum({})
	public role: string;
}
