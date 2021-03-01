import { IUser } from './user.interfaces';

export interface IResponseMessage {
	message: string;
}

export interface IAuthResponseMessage {
	profile: IUser;
	token: string;
}
