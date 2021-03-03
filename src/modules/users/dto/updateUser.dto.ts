import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	readonly name?: string;

	@IsOptional()
	@IsString()
	@MinLength(3)
	readonly login?: string;

	@IsOptional()
	@IsEmail()
	readonly email?: string;

	@IsOptional()
	@IsString()
	@MinLength(8)
	readonly password?: string;
}
