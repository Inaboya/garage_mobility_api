import { Module } from '@nestjs/common';
import { BlogSchema } from './schema';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
   
    ],
    exports: [BlogService],
    controllers: [BlogController],
    providers: [BlogService],
  })
export class BlogModule {}
