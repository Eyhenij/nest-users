import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	login: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;
}
