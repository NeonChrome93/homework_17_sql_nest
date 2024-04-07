import { Injectable } from '@nestjs/common';
import { QueryPaginationType } from '../../../../utils/pagination';
import { DataSource } from 'typeorm';
import { CommentsViewType } from '../api/models/output/comments.output.models';
import { query } from 'express';

@Injectable()
export class CommentsQueryRepository {
    constructor(private readonly dataSource: DataSource) {}

    async readCommentByPostId(postId: string, pagination: QueryPaginationType, userId?: string | null) {
        // const filter: FilterQuery<CommentsDBType> = { postId };
        // const comments: CommentsDBType[] = await this.CommentModel.find(filter)
        //     .sort({ [pagination.sortBy]: pagination.sortDirection })
        //     .skip(pagination.skip)
        //     .limit(pagination.pageSize)
        //     .lean();
        //
        // const totalCount = await this.CommentModel.countDocuments(filter).exec();
        // const items: CommentsViewType[] = comments.map((c: CommentsDBType) => ({
        //     id: c._id.toString(),
        //     content: c.content,
        //     commentatorInfo: c.commentatorInfo,
        //     createdAt: c.createdAt.toISOString(),
        //     likesInfo: {
        //         likesCount: c.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
        //         dislikesCount: c.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
        //         myStatus: userId
        //             ? c.reactions.filter(r => r.userId === userId).length
        //                 ? c.reactions.filter(r => r.userId === userId)[0].status
        //                 : REACTIONS_ENUM.None
        //             : REACTIONS_ENUM.None,
        //     },
        // }));
        // const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        // return {
        //     pagesCount: pagesCount === 0 ? 1 : pagesCount,
        //     page: pagination.pageNumber,
        //     pageSize: pagination.pageSize,
        //     totalCount,
        //     items,
        // }
        return postId;
    }

    async readCommentId(id: string, userId?: string | null): Promise<CommentsViewType | null> {
        const query = `WITH comment_info AS (
    SELECT 
        c.id AS comment_id,
        c.content AS content,
        c.userId AS commentator_id,
        a.userLogin AS user_login,
        c.createdAt AS created_at
    FROM comments c
    JOIN accounts a ON c.userId = a.id
    ),
    likes_info AS (
    SELECT 
        c.id AS comment_id,
        COUNT(CASE WHEN l.status = 'Like' THEN 1 END) AS likes_count,
        COUNT(CASE WHEN l.status = 'Dislike' THEN 1 END) AS dislikes_count,
        SUM(CASE WHEN l.userId = 'myUserId' THEN 1 ELSE 0 END) AS my_status
    FROM comments c
    LEFT JOIN likes l ON c.id = l.commentId
    GROUP BY c.id
    )
    SELECT 
        c.comment_id AS id,
        c.content AS content,
        json_build_object('userId', c.commentator_id, 'userLogin', c.user_login) AS commentatorInfo,
        c.created_at AS createdAt,
        json_build_object('likesCount', COALESCE(l.likes_count, 0), 'dislikesCount', COALESCE(l.dislikes_count, 0), 'myStatus', CASE WHEN l.my_status > 0 THEN 'Like' ELSE 'None' END) AS likesInfo
        FROM comment_info c
        LEFT JOIN likes_info l ON c.comment_id = l.comment_id;`;

        const view = await this.dataSource.query(query);
        return view[0];
    }
}
