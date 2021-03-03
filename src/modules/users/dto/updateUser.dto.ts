import { Contains, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
	@ApiPropertyOptional({ type: 'string' })
	@IsOptional()
	@IsString()
	readonly name?: string;

	@ApiPropertyOptional({
		type: 'string',
		minLength: 3,
		example: '@login',
		uniqueItems: true
	})
	@IsOptional()
	@IsString()
	@Contains('@')
	@MinLength(3)
	readonly login?: string;

	@ApiPropertyOptional({
		type: 'email',
		example: 'example@email.com',
		uniqueItems: true
	})
	@IsOptional()
	@IsEmail()
	readonly email?: string;

	@ApiPropertyOptional({ type: 'string' })
	@IsOptional()
	@IsString()
	@MinLength(8)
	readonly password?: string;
}
