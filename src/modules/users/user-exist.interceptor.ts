import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class UserExistInterceptor implements NestInterceptor {
	constructor(private readonly _usersService: UsersService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return from(this._usersService.checkUserExist(request.params.id)).pipe(
			switchMap((doesUserExist: boolean) => {
				if (!doesUserExist) {
					throw new NotFoundException('userId not exist');
				}
				return next.handle();
			})
		);
	}
}
