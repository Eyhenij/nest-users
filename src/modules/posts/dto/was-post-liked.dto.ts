import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WasPostLikedDto {
	@ApiProperty({ required: true, type: 'string' })
	@IsNotEmpty()
	@IsString()
	public postUUID: string;

	@ApiProperty({ required: true, type: 'boolean' })
	@IsNotEmpty()
	@IsBoolean()
	public value: boolean;
}
