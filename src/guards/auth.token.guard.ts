import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		if (request.headers['authorization']) {
			return await this._authService.verifyToken(request.headers['authorization']);
		}
		throw new UnauthorizedException('There are no authorization headers in the request');
	}
}
