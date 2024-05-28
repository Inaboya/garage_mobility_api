import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  BlogPaginatedDto,
  CreatePostDTO,
  QueryParamDto,
  UpdatePostDto,
} from './dto';
import { BlogInterface } from './interface';

@ApiTags('Blogs')
@Controller('posts')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Get Blogs from Blogs Collection' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Get blogs',
  })
  @Get()
  async getAllBlogs(@Query() queryParams: QueryParamDto) {
    return await this.blogService.getAllBlogs(queryParams);
  }

  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Blog post created successfully',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'BAD REQUEST',
  })
  @Post()
  async createBlogPost(@Body() createPostDto: CreatePostDTO) {
    return await this.blogService.createPost(createPostDto);
  }

  @ApiOperation({ summary: 'Fetch single blog' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Blog post fetched successfully',
  })
  @ApiParam({
    name: 'postId',
    description: 'valid mongodb id',
    required: true,
  })
  @Get(':postId')
  async getMovie(@Param('postId') id: string): Promise<{
    statusCode: number;
    data?: BlogInterface;
    message: string;
  }> {
    return await this.blogService.getBlog(id);
  }

  @ApiOperation({ summary: 'Update a blog post' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: 'Blog post created successfully',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'BAD REQUEST',
  })
  @ApiParam({
    name: 'postId',
    description: 'A valid mongodb id',
    required: true,
  })
  @Patch(':postId')
  async updateBlogPost(
    @Body() payload: UpdatePostDto,
    @Param('postId') id: string,
  ) {
    return await this.blogService.updateBlogPost(payload, id);
  }

  @ApiOperation({ summary: 'Delete blog' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Blog post deleted successfully',
  })
  @ApiParam({
    name: 'postId',
    description: 'valid mongodb id',
    required: true,
  })
  @Delete(':postId')
  async deleteBlog(@Param('postId') id: string) {
    return await this.blogService.deleteBlog(id);
  }
}
