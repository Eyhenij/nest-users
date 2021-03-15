import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MakeLikeDto {
	@ApiProperty({ required: true, type: 'boolean' })
	@IsNotEmpty()
	@IsBoolean()
	public rollback: boolean;
}
