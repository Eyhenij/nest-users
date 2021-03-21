import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
	Query,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessageDto } from '../../common/response.dtos';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { PostsService } from './posts.service';
import { Post as UsersPost } from './post.model';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthTokenGuard } from '../../guards/auth.token.guard';
import { WasPostLikedDto } from './dto/was-post-liked.dto';

@Controller('api/posts')
@ApiTags('users posts')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class PostsController {
	constructor(private readonly _postsService: PostsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get all posts of chosen user' })
	@ApiResponse({ status: 200, description: 'get array of posts:success', type: [UsersPost] })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	public async findAll(@Query('userUUID', new ParseUUIDPipe()) userUUID: string): Promise<UsersPost[]> {
		return await this._postsService.findAll(userUUID);
	}

	@Get(':userUUID')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get one post by id' })
	@ApiResponse({ status: 200, description: 'get one post:success', type: UsersPost })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'userId does not exist', type: NotFoundException })
	public async findOne(
		@Param('userUUID', new ParseUUIDPipe()) userUUID: string,
		@Query('postUUID', new ParseUUIDPipe()) postUUID: string
	): Promise<UsersPost> {
		return await this._postsService.findOneById(userUUID, postUUID);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'create new post' })
	@ApiResponse({ status: 201, description: 'create post:success', type: UsersPost })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiBody({ type: CreatePostDto })
	public async create(@Body() createPostData: CreatePostDto): Promise<UsersPost> {
		return await this._postsService.create(createPostData);
	}

	@Put(':postUUID')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'update one post by id' })
	@ApiResponse({ status: 201, description: 'update post:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'post does not exist', type: NotFoundException })
	@ApiBody({ type: CreateUserDto })
	public async updateOne(
		@Body() updatePostData: CreatePostDto,
		@Param('postUUID', new ParseUUIDPipe()) postUUID: string
	): Promise<ResponseMessageDto> {
		return await this._postsService.updateOne(updatePostData, postUUID);
	}

	@Delete(':postUUID')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'delete post by id' })
	@ApiResponse({ status: 200, description: 'delete post:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'post does not exist', type: NotFoundException })
	public async remove(@Param('postUUID', new ParseUUIDPipe()) postUUID: string): Promise<ResponseMessageDto> {
		return await this._postsService.remove(postUUID);
	}

	@Get('like/:postUUID')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'boolean-value if post was liked by this user' })
	@ApiResponse({ status: 200, description: 'value = true | false', type: WasPostLikedDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'post does not exist', type: NotFoundException })
	public async wasLiked(
		@Param('postUUID', new ParseUUIDPipe()) postUUID: string,
		@Query('userUUID', new ParseUUIDPipe()) userUUID: string
	): Promise<WasPostLikedDto> {
		return await this._postsService.wasLiked(userUUID, postUUID);
	}

	@Put('like/:postUUID')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'make like of post by post id' })
	@ApiResponse({ status: 201, description: 'like post:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'post does not exist', type: NotFoundException })
	public async makeLike(
		@Param('postUUID', new ParseUUIDPipe()) postUUID: string,
		@Query('userUUID', new ParseUUIDPipe()) userUUID: string,
		@Query('rollback') rollback: boolean
	): Promise<ResponseMessageDto> {
		return await this._postsService.makeLike(userUUID, postUUID, rollback);
	}

	@Get('dislike/:postUUID')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'boolean-value if post was liked by this user' })
	@ApiResponse({ status: 200, description: 'value = true | false', type: WasPostLikedDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'post does not exist', type: NotFoundException })
	public async wasDisliked(
		@Param('postUUID', new ParseUUIDPipe()) postUUID: string,
		@Query('userUUID', new ParseUUIDPipe()) userUUID: string
	): Promise<WasPostLikedDto> {
		return await this._postsService.wasDisliked(userUUID, postUUID);
	}

	@Put('dislike/:postUUID')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'make dislike of post by post id' })
	@ApiResponse({ status: 201, description: 'dislike post:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'post does not exist', type: NotFoundException })
	public async makeDisLike(
		@Param('postUUID', new ParseUUIDPipe()) postUUID: string,
		@Query('userUUID', new ParseUUIDPipe()) userUUID: string,
		@Query('rollback') rollback: boolean
	): Promise<ResponseMessageDto> {
		return await this._postsService.makeDisLike(userUUID, postUUID, rollback);
	}
}
