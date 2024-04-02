import { Injectable } from '@nestjs/common';
import { NewestLikeType, PostViewType } from '../api/models/output/post-output.model';
import { REACTIONS_ENUM } from '../../comments/api/models/output/comments.output.models';
import { PaginationModels, QueryPaginationType } from '../../../../utils/pagination';
import { DataSource } from 'typeorm';
import { postDbType, StatusType } from '../domain/post.entity';
import { PostMapperImp } from '../../../../utils/mappers/post.mapper';
import { BlogDbType } from '../../../admin/blogs/domain/blog.entity';

class PostMapper {}

@Injectable()
export class PostsQueryRepository {
    constructor(private readonly dataSource: DataSource) {}

    async readPosts(
        pagination: QueryPaginationType,
        userId?: string | null,
    ): Promise<PaginationModels<PostViewType[]>> {
        const queryFilter = `
				select *
					from public.posts
						order by "${pagination.sortBy}" ${pagination.sortDirection}
					 limit ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}
				
	`;
        const posts = await this.dataSource.query(queryFilter);
        console.log(posts[0]);
        const queryCount = `SELECT count(id)
                            FROM public.posts`;

        const totalPostCount = await this.dataSource.query(queryCount, []);
        const totalCount = parseInt(totalPostCount[0].count);

        const mapper = new PostMapperImp();
        const items: PostViewType[] = posts.map((post: postDbType) => mapper.mapPostDbToPostView(post));
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items,
        };
    }

    async readPostId(postId: string, userId?: string | null): Promise<PostViewType | null> {
        const query = `SELECT * FROM public.posts
                    WHERE id = $1`;

        try {
            console.log(postId);
            const post: postDbType[] = await this.dataSource.query(query, [postId]);

            return new PostMapperImp().mapPostDbToPostView(post[0]);
        } catch (error) {
            console.log(error);
            return null; // Возвращаем null в случае любых ошибок
        }
    }
}
