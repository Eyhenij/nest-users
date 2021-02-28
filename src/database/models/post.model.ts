import { Column, Table, DataType, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Post extends Model<Post> {
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		primaryKey: true
	})
	public id: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	@ForeignKey(() => User)
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
