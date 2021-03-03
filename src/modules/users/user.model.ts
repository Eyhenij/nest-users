import { Column, Table, DataType, Model, HasMany } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/post.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ timestamps: false, freezeTableName: true, tableName: 'users' })
@HasMany(() => Post)
export class User extends Model {
	@ApiProperty({
		required: true,
		type: 'string'
	})
	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	public name: string;

	@ApiProperty({
		required: true,
		type: 'string',
		minLength: 3,
		example: '@login',
		uniqueItems: true
	})
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	public login: string;

	@ApiProperty({
		required: true,
		type: 'email',
		example: 'example@email.com',
		uniqueItems: true
	})
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
		validate: { isEmail: true }
	})
	public email: string;

	@ApiProperty({
		required: true,
		type: 'string',
		minLength: 8
	})
	@Column({
		type: DataType.STRING,
		allowNull: false,
		set(value) {
			const salt = bcrypt.genSaltSync();
			this.setDataValue('password', bcrypt.hashSync(value, salt));
		}
	})
	public password: string;

	@ApiProperty({
		required: true,
		type: 'number',
		uniqueItems: true,
		readOnly: true
	})
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	})
	public id: number;

	@ApiProperty({
		required: true,
		type: 'enum',
		example: 'user',
		enum: ['user', 'admin', 'guest']
	})
	@Column({
		type: DataType.ENUM,
		allowNull: false,
		values: ['user', 'admin', 'guest'],
		defaultValue: 'user'
	})
	public role: string;

	@ApiProperty({
		required: true,
		type: 'enum',
		example: 'online',
		enum: ['online', 'offline']
	})
	@Column({
		type: DataType.ENUM,
		allowNull: false,
		values: ['online', 'offline'],
		defaultValue: 'offline'
	})
	public status: string;
}
