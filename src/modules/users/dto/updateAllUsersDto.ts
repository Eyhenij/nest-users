import { CreateUserDto } from './createUser.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateAllUsersDto {
	@ApiProperty({
		required: true,
		type: [CreateUserDto]
	})
	@IsNotEmpty()
	@IsArray()
	arr: CreateUserDto[];
}
