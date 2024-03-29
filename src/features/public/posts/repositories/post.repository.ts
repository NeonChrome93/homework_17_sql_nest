import { PostType, UpdatePostDto, UpdatePostForBlogDto } from '../api/models/input/post-input.model';
import { PostViewType } from '../api/models/output/post-output.model';
import { REACTIONS_ENUM } from '../../comments/api/models/output/comments.output.models';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { postDbType } from '../domain/post.entity';

@Injectable()
export class PostRepository {
    constructor(private dataSource: DataSource) {}

    async readPostId(postId: string): Promise<postDbType | null> {
        const query = `SELECT * FROM public.posts
                     WHERE id = $1`;
        const post = await this.dataSource.query(query, [postId]);
        return post[0];
    }

    async createPost(newPost: PostType): Promise<PostViewType> {
        const query = `INSERT INTO public.posts(
                        title, "shortDescription", content, "blogId", "blogName", "createdAt")
                        VALUES ($1, $2, $3, $4, $5, $6)
                        returning *;`;

        const post = await this.dataSource.query(query, [
            newPost.title,
            newPost.shortDescription,
            newPost.content,
            newPost.blogId,
            newPost.blogName,
            newPost.createdAt,
        ]);
        return PostType.toVievModel(post[0]);
    }

    async updatePosts(postId: string, blogId: string, newUpdateRequest: UpdatePostForBlogDto): Promise<boolean> {
        const query = `UPDATE public.posts
                        SET title=$1, "shortDescription"=$2, content=$3, "blogId"=$4 
                        WHERE id = $5;`;
        await this.dataSource.query(query, [
            newUpdateRequest.title,
            newUpdateRequest.shortDescription,
            newUpdateRequest.content,
            blogId,
            postId,
        ]);
        return true;
    }

    async updatePostReaction(post: postDbType) {
        // return this.PostModel.updateOne(
        //     { _id: post._id },
        //     {
        //         $set: { ...post },
        //     },
        // );
        return post.id;
    }

    async deletePosts(postId: string): Promise<boolean> {
        const query = `DELETE FROM public.posts
                        WHERE id = $1`;

        const deleted = await this.dataSource.query(query, [postId]);

        if (!deleted) return false;
        return true;
    }
}
