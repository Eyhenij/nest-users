import { IPost } from './post.inteface';

export interface IUser {
	name: string;
	login: string;
	email: string;
	password?: string;
	id: number;
	role: string;
	status: string;
	posts: IPost[];
}
