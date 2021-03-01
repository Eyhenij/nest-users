import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
	timestamps: false,
	freezeTableName: true,
	tableName: 'posts'
})
@BelongsTo(() => User, { as: 'posts', onDelete: 'CASCADE' })
export class Post extends Model {
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		primaryKey: true
	})
	public id: number;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	public userId: number;

	@Column({
		type: DataType.STRING,
		defaultValue: '',
		allowNull: true
	})
	public content: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false
	})
	public countOfLikes: number;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
		allowNull: false
	})
	public countOfDislikes: number;
}
