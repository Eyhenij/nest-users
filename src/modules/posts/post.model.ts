import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({
	timestamps: false,
	freezeTableName: true,
	tableName: 'posts'
})
@BelongsTo(() => User, { as: 'posts', onDelete: 'CASCADE' })
export class Post extends Model {
	@ApiProperty()
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		primaryKey: true
	})
	public id: number;

	@ApiProperty()
	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	public userId: number;

	@ApiProperty()
	@Column({
		type: DataType.STRING,
		defaultValue: '',
		allowNull: true
	})
	public content: string;

	@ApiProperty()
	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false
	})
	public countOfLikes: number;

	@ApiProperty()
	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false
	})
	public countOfDislikes: number;
}
