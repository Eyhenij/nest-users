import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public userUUID: string;

	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public parentUUID: string;

	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public content: string;
}
