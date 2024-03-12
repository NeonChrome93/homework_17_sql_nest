import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, UserDbModel } from '../domain/db-model';

@Injectable()
export class UserRepository {
    constructor(private dataSource: DataSource) {}

    async createUser(newUser: UserDbModel) {
        console.log(newUser.createdAt);
        const userId = await this.dataSource.query(
            `
			INSERT INTO public.users("login", "email", "passwordHash", "createdAt",  "confirmationCode", "expirationDateOfRecoveryCode", "isConfirmed")
				VALUES ($1, $2, 
				$3, $4, $5, $6, $7)
				returning id
	`,
            [
                newUser.login,
                newUser.email,
                newUser.passwordHash,
                newUser.createdAt,
                newUser.confirmationCode,
                newUser.expirationDateOfRecoveryCode,
                newUser.isConfirmed,
            ],
        );
        console.log(userId);
        return userId[0].id;
    }

    async deleteUser(userId: string) {
        const query = `DELETE FROM public."users"
			  WHERE "id" = $1`;
        const deleted = await this.dataSource.query(query, [userId]);
        if (!deleted) return false;
        return true;
    }

    async readUserById(id: string): Promise<User | null> {
        const result: User | null = await this.dataSource.query(
            `
        SELECT  *
        FROM public.users
        WHERE "id" = $1;
`,
            [id],
        );
        return result[0];
    }

    async saveUser(newUser: User) {
        const user = newUser;
        return user;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        return null;
    }

    async findUserByRecoveryCode(recoveryCode: string): Promise<User | null> {
        const result = await this.dataSource.query(
            `
        SELECT  "passwordRecoveryCode"
        FROM public.users
        WHERE "passwordRecoveryCode" = $1;
`,
            [recoveryCode],
        );
        return result[0];
    }

    async readUserByCode(code: string): Promise<User | null> {
        // const user: User | null = await this.UserModel.findOne({confirmationCode: code});
        // if (!user) {
        //     return null;
        // }
        // return user
        return null;
    }

    async readUserByEmail(email: string): Promise<User | null> {
        return null;
    }

    async updateConfirmationCode(id: string, newCode: string): Promise<any> {
        return null;
    }

    async confirmEmail(id: string): Promise<void> {
        return null;
    }
}
