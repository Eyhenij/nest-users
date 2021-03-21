import { Column, Table, DataType, Model, ForeignKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.model';

@Table({ timestamps: false, freezeTableName: true, tableName: 'follower' })
export class Following extends Model {
	@ForeignKey(() => User)
	@ApiProperty({ required: false, type: 'string' })
	@Column({ type: DataType.UUID, allowNull: false })
	public userUUID: string;

	@ApiProperty({ required: false, type: 'string' })
	@Column({ type: DataType.UUID, allowNull: false })
	public followingUUID: string;
}
