import { Contains, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	@Contains('@')
	@MinLength(3)
	login: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;
}
