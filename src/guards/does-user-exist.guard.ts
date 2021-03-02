import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class DoesUserExistGuard implements CanActivate {
	constructor(private readonly _usersService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = await this._usersService.checkUserExist(request.params.id);
		if (!user) {
			throw new NotFoundException('userId not exist');
		}
		return true;
	}
}
