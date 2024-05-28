import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  author: string;
}

export type BlogDocument = Blog & mongoose.Document;

export const BlogSchema = SchemaFactory.createForClass(Blog);
