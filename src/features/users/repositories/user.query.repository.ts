import { PaginationModels } from '../../../utils/pagination';
import { Injectable } from '@nestjs/common';
import { UserViewModel } from '../api/models/output/user.output.model';
import { DataSource } from 'typeorm';
import { User } from '../domain/db-model';

@Injectable()
export class UsersQueryRepository {
    constructor(private dataSource: DataSource) {}

    // async getUsers(pagination: QueryUserPaginationType): Promise<PaginationModels<UserViewModel[]>> {
    //     const filter = {
    //         $or: [
    //             { login: { $regex: pagination.searchLoginTerm, $options: 'i' } },
    //             { email: { $regex: pagination.searchEmailTerm, $options: 'i' } },
    //         ],
    //     };
    //
    //     const users = await this.UserModel.find(filter)
    //         .sort({ [pagination.sortBy]: pagination.sortDirection })
    //         .skip(pagination.skip)
    //         .limit(pagination.pageSize)
    //         .exec();
    //
    //     const totalCount = await this.UserModel.countDocuments(filter).exec();
    //     const items = users.map(u => ({
    //         id: u._id.toString(),
    //         login: u.login,
    //         email: u.email,
    //         createdAt: u.createdAt.toISOString(),
    //     }));
    //     const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    //     return {
    //         pagesCount: pagesCount === 0 ? 1 : pagesCount,
    //         page: pagination.pageNumber,
    //         pageSize: pagination.pageSize,
    //         totalCount,
    //         items,
    //     };
    // }

    async getUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string,
    ): Promise<PaginationModels<UserViewModel[]>> {
        // if (sortBy === 'login') {
        //     sortBy = 'userName';
        // }
        console.log(pageNumber, pageSize);
        const queryFilter = `
				select *
					from public."users"
					WHERE "login" ILIKE '%${searchLoginTerm}%' OR "email" ILIKE '%${searchEmailTerm}%'
						order by "${sortBy}" ${sortDirection}
					  limit ${pageSize} offset ${(pageNumber - 1) * pageSize}
	`;

        const findAllUsers = await this.dataSource.query(queryFilter);

        // console.log(findAllUsers);
        const countTotalCount = `
		    SELECT count(id)
			  from "users"
				WHERE "login" ILIKE $1 OR "email" ILIKE $2
	`;

        const resultCount = await this.dataSource.query(countTotalCount, [
            `%${searchLoginTerm}%`,
            `%${searchEmailTerm}%`,
        ]);
        const totalCount = resultCount[0].count;

        const pagesCount: number = await Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: +totalCount,
            items: findAllUsers.map(
                (user: User): UserViewModel => ({
                    id: user.id.toString(),
                    login: user.login,
                    email: user.email,
                    createdAt: user.createdAt.toISOString(),
                }),
            ),
        };
    }
}
