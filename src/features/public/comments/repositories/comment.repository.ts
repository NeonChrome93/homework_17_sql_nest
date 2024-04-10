import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentsDBType } from '../domain/comment.entity';
import { UpdateCommentDto } from '../api/models/input/comment.input.model';
import { postDbType } from '../../posts/domain/post.entity';
import { likeTypeComment } from '../../posts/api/models/output/post-output.model';

@Injectable()
export class CommentRepository {
    constructor(private dataSource: DataSource) {}

    // async readCommentIdDbType(id: string): Promise<Comments | null> {
    //     if (!ObjectId.isValid(id)) return null;
    //     return this.CommentModel.findOne({ _id: new ObjectId(id) }).lean();
    // }
    //
    async createComment(newComment: CommentsDBType): Promise<boolean> {
        const comment = await this.dataSource.query(
            `INSERT INTO public.comments( "postId", content, "userId", "createdAt")
                        VALUES ($1, $2, $3, $4)
                        returning id;`,
            [newComment.postId, newComment.content, newComment.userId, newComment.createdAt],
        );

        return comment[0].id;
    }

    async createLikeByComment(likes: likeTypeComment) {
        const query = `INSERT INTO public.comments_likes( "userId", "createdAt", status, "commentId")
        VALUES ($1, $2, $3, $4)
        returning *`;

        return await this.dataSource.query(query, [likes.userId, likes.createdAt, likes.status, likes.commentId]);
    }

    async updateComment(commentId: string, newUpdateRequest: UpdateCommentDto): Promise<boolean> {
        const query = `UPDATE public.comments
                        SET "content"  = $1
                        WHERE id = $2`;

        const updated = await this.dataSource.query(query, [newUpdateRequest, commentId]);
        if (!updated) return true;
        return false;
    }

    async readLikesCommentId(commentId: string, userId: string): Promise<likeTypeComment | null> {
        const query = `SELECT * FROM public.comments_likes
                     WHERE "commentId" = $1 AND  "userId" = $2`;
        const like = await this.dataSource.query(query, [commentId, userId]);
        console.log(like);
        if (!like) return null;
        return like[0];
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const query = `DELETE FROM public.comments
                        WHERE id = $1`;

        const deleted = await this.dataSource.query(query, [commentId]);
        if (!deleted) return false;
        return true;
    }

    async updateCommentReactions(likes: likeTypeComment) {
        const query = `UPDATE public.comments_likes
                     SET  "userId"=$1, "createdAt"=$2, status=$3
                     WHERE "commentId"=$4;`;

        return await this.dataSource.query(query, [likes.userId, likes.createdAt, likes.status, likes.commentId]);
    }
}
