import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly _authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		if (request.headers['authorization']) {
			const role: string = await this._authService.verifyUserRole(request.headers['authorization']);
			return role === 'admin';
		}
		throw new UnauthorizedException('There are no authorization headers in the request');
	}
}
