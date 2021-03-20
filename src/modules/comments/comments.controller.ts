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
import { AuthTokenGuard } from '../../guards/auth.token.guard';
import { ResponseMessageDto } from '../../common/response.dtos';
import { CommentsService } from './comments.service';
import { Comment } from './comment.model';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class CommentsController {
	constructor(private readonly _commentsService: CommentsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get all comments of chosen parent' })
	@ApiResponse({ status: 200, description: 'get array of comments:success', type: [Comment] })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	public async findAll(@Query('userUUID', new ParseUUIDPipe()) userUUID: string): Promise<Comment[]> {
		return await this._commentsService.findAll(userUUID);
	}

	@Get(':commentUUID')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'get one comment by id' })
	@ApiResponse({ status: 200, description: 'get one comment:success', type: Comment })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'comment does not exist', type: NotFoundException })
	public async findOne(@Param('commentUUID', new ParseUUIDPipe()) commentUUID: string): Promise<Comment> {
		return await this._commentsService.findOneByUUID(commentUUID);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'create new comment' })
	@ApiResponse({ status: 201, description: 'create comment:success', type: Comment })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiBody({ type: CreateCommentDto })
	public async create(@Body() createPostData: CreateCommentDto): Promise<Comment> {
		return await this._commentsService.create(createPostData);
	}

	@Put()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ description: 'update one comment by id' })
	@ApiResponse({ status: 201, description: 'update comment:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'comment does not exist', type: NotFoundException })
	@ApiBody({ type: CreateCommentDto })
	public async updateOne(@Body() updateCommentData: UpdateCommentDto): Promise<ResponseMessageDto> {
		return await this._commentsService.updateOne(updateCommentData);
	}

	@Delete(':commentUUID')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ description: 'delete comment by id' })
	@ApiResponse({ status: 200, description: 'delete post:success', type: ResponseMessageDto })
	@ApiResponse({ status: 401, description: 'unauthorized', type: UnauthorizedException })
	@ApiResponse({ status: 404, description: 'comment does not exist', type: NotFoundException })
	public async remove(@Param('commentUUID', new ParseUUIDPipe()) commentUUID: string): Promise<ResponseMessageDto> {
		return await this._commentsService.remove(commentUUID);
	}
}
