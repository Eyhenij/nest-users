import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.model';

export class CurrentPostsResponseDto {
	@ApiProperty({ required: true, type: 'number' })
	@IsNotEmpty()
	@IsNumber()
	public totalCount: number;

	@ApiProperty({ required: true, type: 'array' })
	@IsNotEmpty()
	@IsArray()
	public items: Post[];
}
