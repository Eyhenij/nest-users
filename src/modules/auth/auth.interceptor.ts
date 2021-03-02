import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
	constructor(private readonly _authService: AuthService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return from(this._authService.checkLoginExist(request.body.login)).pipe(
			switchMap((doesUserExist: boolean) => {
				if (!doesUserExist) {
					throw new NotFoundException('userId not exist');
				}
				return next.handle();
			})
		);
	}
}
