import { User } from '../modules/users/user.model';

export interface IResponseMessage {
	message: string;
}

export interface IAuthResponseMessage {
	profile: User;
	token: string;
}
