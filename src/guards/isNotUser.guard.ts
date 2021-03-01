import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../modules/users/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class IsNotUserGuard implements CanActivate {
	constructor(
		@InjectModel(User)
		private readonly _usersRepository: typeof User
	) {}

	canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request);
	}

	async validateRequest(userId: string): Promise<boolean> {
		const user = await this._usersRepository.findOne<User>({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException('userId does not exist');
		}
		return true;
	}
}
