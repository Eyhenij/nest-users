import { Column, Table, DataType, Model, HasMany } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/post.model';

@Table({
	timestamps: false,
	freezeTableName: true,
	tableName: 'users'
})
export class User extends Model {
	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	public name: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	public login: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
		validate: { isEmail: true }
	})
	public email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		set(value) {
			const salt = bcrypt.genSaltSync();
			this.setDataValue('password', bcrypt.hashSync(value, salt));
		}
	})
	public password: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	})
	public id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		defaultValue: 'user'
	})
	public role: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		defaultValue: 'offline'
	})
	public status: string;

	@HasMany(() => Post)
	public posts: Post[];
}
