import { Column, Table, DataType, Model, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { WhoLikedModel } from './who-liked/whoLiked.model';
import { WhoDislikedModel } from './who-disliked/whoDisliked.model';

@Table({ freezeTableName: true, tableName: 'posts' })
export class Post extends Model {
	@ApiProperty({ required: false, type: 'number', uniqueItems: true, readOnly: true })
	@Column({ type: DataType.UUID, primaryKey: true, field: 'id', defaultValue: DataType.UUIDV4, unique: true })
	public postUUID: number;

	@ApiProperty({ required: true, type: 'string' })
	@ForeignKey(() => User)
	@Column({ type: DataType.UUID, allowNull: false })
	public userUUID: string;

	@ApiProperty({ required: true, type: 'string' })
	@Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
	public title: string;

	@ApiProperty({ required: true, type: 'string' })
	@Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
	public content: string;

	@ApiProperty({ required: false, type: 'number' })
	@Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
	public countOfLikes: number;

	@ApiProperty({ required: false, type: 'number' })
	@Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
	public countOfDislikes: number;

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

	@BelongsTo(() => User, { as: 'posts', onDelete: 'CASCADE' })
	user: User;

	@HasMany(() => WhoLikedModel, { as: 'whoLiked', onDelete: 'CASCADE' })
	whoLiked: WhoLikedModel[];

	@HasMany(() => WhoDislikedModel, { as: 'whoDisliked', onDelete: 'CASCADE' })
	whoDisliked: WhoDislikedModel[];
}
