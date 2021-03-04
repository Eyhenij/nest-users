import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class DoesLoginExistGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = await this._authService.findLogin(request.body.login);
		if (user) {
			throw new ForbiddenException('this login already exist');
		}
		return true;
	}
}
