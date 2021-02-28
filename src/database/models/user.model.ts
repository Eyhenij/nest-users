import { Column, Table, DataType, Model, HasMany, BeforeValidate } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Post } from './post.model';

@Table
export class User extends Model<User> {
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
		async set(value) {
			const salt = await bcrypt.genSalt();
			await this.setDataValue('password', bcrypt.hash(value, salt));
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

	@BeforeValidate
	public static validateData(user: User, options: any) {
		if (!options.transaction) throw new Error('Missing transaction.');
		if (!user.name) throw new Error('user:create:missingFirstName');
		if (!user.login) throw new Error('user:create:missingLastName');
		if (!user.email) throw new Error('user:create:missingEmail');
		if (!user.password) throw new Error('user:create:missingPassword');
	}
}
