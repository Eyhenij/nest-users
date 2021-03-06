import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AuthTokenGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		if (request.headers['authorization']) {
			return !!(await this._authService.verifyToken(request.headers['authorization']));
		}
		throw new UnauthorizedException('there are no authorization headers in the request');
	}
}
