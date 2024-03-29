import { Injectable } from '@nestjs/common';
import { PaginationModels, QueryPaginationType } from '../../../../utils/pagination';
import { BlogsViewType } from '../api/models/output/blog.output.model';
import { DataSource } from 'typeorm';
import { Blog, BlogDbType } from '../domain/blog.entity';
import { PostViewType } from '../../../public/posts/api/models/output/post-output.model';
import { postDbType } from '../../../public/posts/domain/post.entity';

@Injectable()
export class BlogQueryRepository {
    constructor(private dataSource: DataSource) {}

    async readBlogs(pagination: QueryPaginationType): Promise<PaginationModels<BlogsViewType[]>> {
        //
        //     const filter: FilterQuery<BlogDbType> = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}

        const queryFilter = `
				select *
					from public."blogs"
					WHERE "name" ILIKE '%${pagination.searchNameTerm}%' 
						order by "${pagination.sortBy}" ${pagination.sortDirection}
					  limit ${pagination.pageSize} offset ${(pagination.pageNumber - 1) * pagination.pageSize}
	`;

        //
        //     const blogs = await this.BlogModel
        //         .find(filter, null, {lean: true})
        //         .sort({[pagination.sortBy]: pagination.sortDirection})
        //         .skip(pagination.skip)
        //         .limit(pagination.pageSize)
        //         .lean()
        //         .exec()
        //
        //     const totalCount = await this.BlogModel.countDocuments(filter).exec()
        //     const items: BlogsViewType[] = blogs.map((b) => ({
        //         id: b._id.toString(),
        //         name: b.name,
        //         description: b.description,
        //         websiteUrl: b.websiteUrl,
        //         createdAt: b.createdAt.toISOString(),
        //         isMembership: b.isMembership
        //
        //
        //     }))
        //     const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        //     return {
        //         pagesCount: pagesCount === 0 ? 1 : pagesCount,
        //         page: pagination.pageNumber,
        //         pageSize: pagination.pageSize,
        //         totalCount: totalCount,
        //         items
        //     }
        // }
        //
        // async readBlogsId(id: string): Promise<BlogsViewType | null> {
        //     const blog  = await this.BlogModel.findOne({_id: new ObjectId(id)}).exec()//logic
        //
        //     if (!blog) {
        //         return null;
        //     }

        const findAllBlogs = await this.dataSource.query(queryFilter);

        // console.log(findAllUsers);
        const countTotalCount = `
		    SELECT count(id)
			  from "blogs"
				WHERE "name" ILIKE $1
	`;

        const resultCount = await this.dataSource.query(countTotalCount, [`%${pagination.searchNameTerm}%`]);
        const totalCount = resultCount[0].count;

        const pagesCount: number = Math.ceil(+totalCount / pagination.pageSize);

        return {
            pagesCount: pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: +totalCount,
            items: findAllBlogs.map(
                (blog: BlogDbType): BlogsViewType => ({
                    id: blog.id,
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: blog.isMembership,
                }),
            ),
        };
    }

    async readPostsByBlogId(
        blogId: string,
        pagination: QueryPaginationType,
        userId?: string | null,
    ): Promise<PaginationModels<PostViewType[]>> {
        // const filter: FilterQuery<PostType> = { blogId };
        // const posts = await this.PostModel.find(filter)
        //     .sort({ [pagination.sortBy]: pagination.sortDirection })
        //     .skip(pagination.skip)
        //     .limit(pagination.pageSize)
        //     .exec();
        const queryFilter = `
				SELECT * FROM public.posts
					WHERE "blogId" = $1 
						ORDER BY "${pagination.sortBy}" ${pagination.sortDirection}
					  LIMIT ${pagination.pageSize} OFFSET ${(pagination.pageNumber - 1) * pagination.pageSize}
	`;
        const findPostsForBlog = await this.dataSource.query(queryFilter, [blogId]);
        console.log(findPostsForBlog);

        const countTotalCount = `
		    SELECT count(id)
			  FROM public.posts
				WHERE "blogId" = $1
	`;

        const totalPostsCount = await this.dataSource.query(countTotalCount, [blogId]);
        const totalCount: number = parseInt(totalPostsCount[0].count);
        // const items: PostViewType[] = findPostsForBlog.map((p: postDbType) => likesMapper(p, userId));
        const items: PostViewType[] = findPostsForBlog.map((p: postDbType) => ({
            id: p.id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [],
            },
        }));
        console.log(items);
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);

        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items,
        };
    }

    async readBlogsById(id: string): Promise<Blog | null> {
        const query = `SELECT * FROM public.blogs
                        WHERE id = $1`;
        const blog = await this.dataSource.query(query, [id]);
        return blog[0];
    }
}
