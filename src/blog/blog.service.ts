import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogInterface } from './interface';
import {
  BlogPaginatedDto,
  CreatePostDTO,
  QueryParamDto,
  UpdatePostDto,
} from './dto';
import { sendPaginatedResponse, validMongoDBId, validatePost } from 'src/utils';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog')
    public readonly blogModel: Model<BlogInterface>,
  ) {}

  async getAllBlogs(query: QueryParamDto) {
    const { page, limit, searchTerm } = query;
    const pageNumber = Number(page) || 1;
    const pageLimit = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    let totalBlog = 0;

    try {
      if (searchTerm) {
        const allBlogs = await this.blogModel.find();
        const regexp = new RegExp(searchTerm, 'i');

        let filteredBlogs = allBlogs.filter((el) => {
          const isMatch = regexp.test(el.title) || regexp.test(el.author);

          return isMatch;
        });

        totalBlog = filteredBlogs.length;

        filteredBlogs = filteredBlogs.slice(skip).slice(0, pageLimit);

        const metaData = {
          data: filteredBlogs,
          skip,
          limit: pageLimit,
          count: totalBlog,
          page: pageNumber,
        };

        return metaData;
      }

      const blogs = await this.blogModel.find().skip(skip).limit(pageLimit);

      totalBlog = await this.blogModel.countDocuments();

      const metaData = {
        data: blogs || [],
        skip,
        limit: pageLimit,
        count: totalBlog,
        page: pageNumber,
        status: HttpStatus.OK,
      };

      return metaData;
    } catch (error) {
      throw error;
    }
  }

  async createPost(payload: CreatePostDTO) {
    const { title, author, content } = payload;

    try {
      const { errors, isValid } = validatePost(payload);

      if (isValid === false) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: errors,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const newPost = new this.blogModel({
          title,
          author,
          content,
        });

        await newPost.save();

        return {
          status: HttpStatus.CREATED,
          message: 'Blog Post Created Successfully',
          data: newPost,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getBlog(
    id: string,
  ): Promise<{ statusCode: number; data?: BlogInterface; message: string }> {
    try {
      const isValidMongoId = validMongoDBId(id);
      if (isValidMongoId === false) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_ACCEPTABLE,
            error: 'Invalid MongoDB ID',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const blog = await this.blogModel.find({ _id: id });

      if (!blog) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Blog not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: blog as any,
        message: 'Fetch blog successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBlogPost(payload: UpdatePostDto, id: string) {
    const { title, content } = payload;
    try {
      const isValidMongoId = validMongoDBId(id);
      if (isValidMongoId === false) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_ACCEPTABLE,
            error: 'Invalid MongoDB ID',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const blog = await this.blogModel.findById({ _id: id });

      if (!blog) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      blog.title = title ? title : blog.title;
      blog.content = content ? content : blog.content;

      blog.save();

      return {
        statusCode: HttpStatus.OK,
        blog,
        message: 'Blog post updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBlog(id: string) {
    try {
      const isValidMongoId = validMongoDBId(id);
      if (isValidMongoId === false) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_ACCEPTABLE,
            error: 'Invalid MongoDB ID',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const blog = await this.blogModel.findByIdAndRemove({ _id: id });

      if (!blog) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Blog not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: blog,
        message: 'Deleted blog successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
