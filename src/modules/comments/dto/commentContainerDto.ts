import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../comment.model';

export class CommentContainerDto {
	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public parentUUID: string;

	@ApiProperty({ required: true, type: 'array' })
	@IsNotEmpty()
	@IsArray()
	public comments: Comment[];
}
