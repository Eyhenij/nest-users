import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
	@ApiProperty({
		required: true,
		type: 'string',
		minLength: 8
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	readonly password: string;
}
