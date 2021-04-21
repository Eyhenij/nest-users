import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	ParseUUIDPipe,
	Post,
	Query,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from '../comments/dto/createComment.dto';
import { ResponseMessageDto } from '../../common/response.dtos';
import { AuthTokenGuard } from '../../guards/auth.token.guard';
import { FollowedService } from './followed/followed.service';
import { Followed } from './followed/followed.model';
import { Following } from './following/following.model';
import { FollowingService } from './following/following.service';

@Controller('api/followers')
@ApiTags('followers')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class FollowersController {
	constructor(
		private readonly _followedService: FollowedService,
		private readonly _followingService: FollowingService
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get all followed users' })
	@ApiResponse({ status: 200, description: 'get array of followed users:success', type: [Followed] })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'not found', type: NotFoundException })
	public async findAllFollowed(@Query('userUUID', new ParseUUIDPipe()) userUUID: string): Promise<Followed[]> {
		return await this._followedService.findAllFollowed(userUUID);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'follow' })
	@ApiResponse({ status: 201, description: 'follow:success', type: Followed })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiBody({ type: CreateCommentDto })
	public async follow(@Query('followedUUID', new ParseUUIDPipe()) followedUUID: string): Promise<ResponseMessageDto> {
		return await this._followedService.follow(followedUUID);
	}

	@Delete()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'unfollow' })
	@ApiResponse({ status: 200, description: 'unfollow:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'comment does not exist', type: NotFoundException })
	public async unfollow(@Query('followedUUID', new ParseUUIDPipe()) followedUUID: string): Promise<ResponseMessageDto> {
		return await this._followedService.unfollow(followedUUID);
	}

	@Get('following')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get all following users' })
	@ApiResponse({ status: 200, description: 'get array of following users:success', type: [Following] })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'not found', type: NotFoundException })
	public async findAllFollowing(@Query('userUUID', new ParseUUIDPipe()) userUUID: string): Promise<Following[]> {
		return await this._followingService.findAllFollowing(userUUID);
	}
}
