import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './features/users/api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './features/users/repositories/user-repository';
import { DeleteUserUseCase } from './features/users/application/usecases/delete-user.command';
import { CreateUserUseCase } from './features/users/application/usecases/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersQueryRepository } from './features/users/repositories/user.query.repository';
import { AuthController } from './features/auth/api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './features/auth/application/local.strategy';
import { UserService } from './features/users/application/user.service';
import { JwtAdapter } from './features/auth/adapters/jwt.adapter';
import { EmailAdapter } from './features/auth/adapters/email.adapter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './features/auth/application/auth.service';
import { ConfirmEmailUseCase } from './features/auth/application/usecases/confirm-email.usecase';
import { ResendingCodeUseCase } from './features/auth/application/usecases/resending-code.usecase';
import { RegistrationUserUseCase } from './features/auth/application/usecases/registration-user.usecase';
import { NewPasswordSetUseCase } from './features/auth/application/usecases/new-password-set.usecase';
import { AuthLoginUseCase } from './features/auth/application/usecases/auth-login.usecase';
import { PasswordRecoveryUseCase } from './features/auth/application/usecases/password-recovery.usecase';
import { CreateDeviceUseCase } from './features/devices/application/usecases/create-device.usecase';
import { DeleteDeviceUseCase } from './features/devices/application/usecases/delete-device.usecase';
import { DevicesRepository } from './features/devices/repositories/device.repository';
import { DevicesService } from './features/devices/application/device.service';
import { DevicesQueryRepository } from './features/devices/repositories/device.query.repository';
import { DelController } from './testing-all-data/testing.controller';
import { IsUserAlreadyExistConstraint } from './infrastructure/decorators/user-exist.decorator';
import { RegistrationConfirmCodeConstraint } from './infrastructure/decorators/registration-conformation.decorator';
import { RegistrationEmailResendingConstraint } from './infrastructure/decorators/registration-email-resending.decorator';

const adapters = [JwtAdapter, EmailAdapter];
const constraints = [
    IsUserAlreadyExistConstraint,
    RegistrationConfirmCodeConstraint,
    RegistrationEmailResendingConstraint,
];
const useCases = [
    // CreateBlogUseCase,
    // DeleteBlogUseCase,
    // UpdateBlogUseCase,
    // UpdatePostUseCase,
    // AddLikesByPostUseCase,
    // DeletePostUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    CreateDeviceUseCase,
    DeleteDeviceUseCase,
    // CreateCommentUseCase,
    // UpdateCommentUseCase,
    // AddReactionUseCase,
    //DeleteCommentUseCase,
    RegistrationUserUseCase,
    ConfirmEmailUseCase,
    ResendingCodeUseCase,
    PasswordRecoveryUseCase,
    NewPasswordSetUseCase,
    AuthLoginUseCase,
];

@Module({
    imports: [
        // ThrottlerModule.forRoot([
        //     {
        //         // ttl: 10000,
        //         // limit: 5,
        //     },
        //]),
        CqrsModule,
        PassportModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'necron23',
            database: 'blogs-posts',
            entities: [],
            synchronize: false,
        }),
        // смотреть видео о переменных окружения
    ],
    controllers: [AppController, UserController, AuthController, DelController],
    providers: [
        AppService,
        AuthService,
        UserRepository,
        DevicesRepository,
        UsersQueryRepository,
        DevicesQueryRepository,
        LocalStrategy,
        UserService,
        DevicesService,
        ...adapters,
        ...useCases,
        ...constraints,
    ],
})
export class AppModule {}
