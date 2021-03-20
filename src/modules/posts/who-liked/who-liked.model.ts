import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.model';

@Table({ timestamps: false, freezeTableName: true, tableName: 'whoLiked' })
export class WhoLikedModel extends Model {
	@ApiProperty({ required: false, type: 'string', readOnly: true })
	@ForeignKey(() => Post)
	@Column({ type: DataType.UUID, allowNull: false })
	public postUUID: string;

	@ApiProperty({ required: false, type: 'string' })
	@Column({ type: DataType.UUID, allowNull: true })
	public userUUID: string;

	@BelongsTo(() => Post, { as: 'whoLiked', onDelete: 'CASCADE' })
	post: Post;
}
