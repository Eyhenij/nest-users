import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public commentUUID: string;

	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public content: string;
}
