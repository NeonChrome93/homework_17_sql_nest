import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDbModel } from '../domain/db-model';

@Injectable()
export class UserRepository {
  constructor(private dataSource: DataSource) {}

  async createUser(newUser: UserDbModel) {
    console.log(newUser.createdAt);
    const userId = await this.dataSource.query(
      `
			INSERT INTO public.users("login", "email", "passwordHash", "createdAt",  "confirmationCode", "expirationDateOfRecoveryCode", "isConfirmed")
				VALUES ('${newUser.login}', '${newUser.email}', 
				'${newUser.passwordHash}', $1, 
				'${newUser.confirmationCode}', $1, '${newUser.isConfirmed}')
				returning id
	`,
      [newUser.createdAt],
    );
    return userId[0].id;
  }

  async deleteUser(userId: string) {
    //const findUserById: UserDbModel | null =
    //   await this.usersQueryRepository.findUserById(userId);
    // if (!findUserById) return false;

    const query = `
		DELETE FROM public."Users"
			WHERE "id" = $1
	`;
    const deleted = await this.dataSource.query(query, [userId]);
    if (!deleted) return false;
    return true;
  }
}
