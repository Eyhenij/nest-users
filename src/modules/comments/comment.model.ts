import { Column, Table, DataType, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ freezeTableName: true, tableName: 'comment' })
export class Comment extends Model {
	@ApiProperty({ required: false, type: 'string', readOnly: true })
	@Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4, unique: true })
	public commentUUID: string;

	@ApiProperty({ required: false, type: 'string', readOnly: true })
	@Column({ type: DataType.UUID, allowNull: false })
	public parentUUID: string;

	@ApiProperty({ required: false, type: 'string' })
	@Column({ type: DataType.UUID, allowNull: true })
	public userUUID: string;

	@ApiProperty({ required: true, type: 'string' })
	@Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
	public content: string;

	@ApiProperty({ required: false, type: 'date' })
	@CreatedAt
	@Column({ type: DataType.DATE, allowNull: false })
	createdAt: Date;

	@ApiProperty({ required: false, type: 'date' })
	@UpdatedAt
	@Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
	updatedAt: Date;

	@ApiProperty({ required: false, type: 'date' })
	@DeletedAt
	@Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
	deletedAt: Date;
}
