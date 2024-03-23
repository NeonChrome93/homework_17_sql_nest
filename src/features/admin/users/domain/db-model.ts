export type UserDbModel = {
    login: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    createdAt: Date;
    confirmationCode: string;
    isConfirmed: boolean;
    passwordRecoveryCode: string | null;
    expirationDateOfRecoveryCode: Date | null;
};

export class User {
    id: string;
    login: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    createdAt: Date;
    confirmationCode: string;
    isConfirmed: boolean;
    passwordRecoveryCode: string | null;
    expirationDateOfRecoveryCode: Date | null;
}
