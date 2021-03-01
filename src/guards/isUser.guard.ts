import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../modules/users/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class IsUserGuard implements CanActivate {
	constructor(
		@InjectModel(User)
		private readonly _usersRepository: typeof User
	) {}

	canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request);
	}

	async validateRequest(authData): Promise<boolean> {
		const user = await User.findOne({ where: { login: authData.login } });
		if (user) {
			throw new ForbiddenException('This login already exist');
		}
		return true;
	}
}
