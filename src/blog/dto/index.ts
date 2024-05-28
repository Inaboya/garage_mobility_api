import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlogInterface } from '../interface';

export class QueryParamDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  page?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  limit?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  searchTerm?: string;
}

export class BlogPaginatedDto {
  count?: number;

  currentPage?: number;

  previousPage?: boolean;

  nextPage?: boolean;

  data?: BlogInterface[];
}

export class CreatePostDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  author: string;
}

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  content: string;
}
