import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		if (request.headers['authorization']) {
			const role = await this._authService.verifyUserRole(request.headers['authorization']);
			return role === 'admin';
		}
		throw new UnauthorizedException('There are no authorization headers in the request');
	}
}
