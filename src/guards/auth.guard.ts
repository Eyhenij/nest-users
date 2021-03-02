import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		// console.log(request);
		// const user = await this._usersRepository;
		return true;
	}
}
