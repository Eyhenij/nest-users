import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { Post } from './models/post.model';

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: 'mysql',
				host: 'localhost',
				port: 3306,
				username: 'root',
				password: 'password',
				database: 'mydb',
				define: {
					timestamps: false,
					freezeTableName: true
				},
				models: [User, Post]
			});
			// sequelize.addModels([User]);
			// sequelize.addModels([Post]);
			await sequelize.sync();
			return sequelize;
		}
	}
];
