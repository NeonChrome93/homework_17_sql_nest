import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user-repository';
import { User } from '../domain/db-model';

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UserRepository) {}

    // async getUsers(pagination:  QueryUserPaginationType) :Promise<PaginationModels<UserViewModel[]>> {
    //     return usersRepository.getUsers(pagination)
    // },

    // async createUser(userCreateModel: UserCreateModelDto): Promise<UserViewModel> {
    //     const passwordSalt = await bcrypt.genSalt(10)
    //     //  const passwordHash = await this.generateHash(userCreateModel.password, passwordSalt)
    //     const passwordHash = await bcrypt.hash(userCreateModel.password, passwordSalt)
    //
    //     const newUser: User = {
    //         _id: new mongoose.Types.ObjectId(),
    //         login: userCreateModel.login,
    //         email: userCreateModel.email,
    //         passwordHash: passwordHash,
    //         passwordSalt: passwordSalt,
    //         createdAt: new Date(),
    //         confirmationCode: '123',
    //         isConfirmed: true,
    //         passwordRecoveryCode: null,
    //         expirationDateOfRecoveryCode: null
    //     }
    //     console.log('newUser', newUser)
    //
    //     await this.usersRepository.createUser(newUser)
    //     return {
    //         id: newUser._id.toString(),
    //         login: newUser.login,
    //         email: newUser.email,
    //         createdAt: newUser.createdAt.toISOString()
    //     }
    // }

    async findUserById(id: string): Promise<User | null> {
        return this.usersRepository.readUserById(id);
    }
    //сделать гард или стратегию которая будет брать loginOrEmail, password и дергать команду чеккреденшлс
    //если юзер не проходит 401 проходит буду вызывать команду логин

    async checkCredentials(loginOrEmail: string, password: string): Promise<User | null> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        //console.log('user', user);
        if (!user) return null;
        try {
            const passwordHash = await bcrypt.compare(password, user.passwordHash);
            if (!passwordHash) return null;
        } catch (err) {
            console.log('Error', err);
        }

        return user;
    }

    // async generateHash(password: string, salt: string) {
    //     const hash = await bcrypt.hash(password, salt)
    //     return hash
    // }
}
