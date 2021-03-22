import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.model';

export class CurrentUsersResponseDto {
	@ApiProperty({ required: true, type: 'number' })
	@IsNotEmpty()
	@IsNumber()
	public totalCount: number;

	@ApiProperty({ required: true, type: 'array' })
	@IsNotEmpty()
	@IsArray()
	public items: User[];
}
