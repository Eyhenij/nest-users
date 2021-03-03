import { Contains, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
	@ApiProperty({
		required: true,
		type: 'string',
		minLength: 3,
		example: '@login'
	})
	@IsNotEmpty()
	@IsString()
	@Contains('@')
	@MinLength(3)
	login: string;

	@ApiProperty({
		required: true,
		type: 'string'
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;
}
