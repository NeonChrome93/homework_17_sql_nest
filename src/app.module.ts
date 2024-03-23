import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './features/admin/users/api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './features/admin/users/repositories/user-repository';
import { DeleteUserUseCase } from './features/admin/users/application/usecases/delete-user.command';
import { CreateUserUseCase } from './features/admin/users/application/usecases/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersQueryRepository } from './features/admin/users/repositories/user.query.repository';
import { AuthController } from './features/public/auth/api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './features/public/auth/application/local.strategy';
import { UserService } from './features/admin/users/application/user.service';
import { JwtAdapter } from './features/public/auth/adapters/jwt.adapter';
import { EmailAdapter } from './features/public/auth/adapters/email.adapter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './features/public/auth/application/auth.service';
import { ConfirmEmailUseCase } from './features/public/auth/application/usecases/confirm-email.usecase';
import { ResendingCodeUseCase } from './features/public/auth/application/usecases/resending-code.usecase';
import { RegistrationUserUseCase } from './features/public/auth/application/usecases/registration-user.usecase';
import { NewPasswordSetUseCase } from './features/public/auth/application/usecases/new-password-set.usecase';
import { AuthLoginUseCase } from './features/public/auth/application/usecases/auth-login.usecase';
import { PasswordRecoveryUseCase } from './features/public/auth/application/usecases/password-recovery.usecase';
import { CreateDeviceUseCase } from './features/public/devices/application/usecases/create-device.usecase';
import { DeleteDeviceUseCase } from './features/public/devices/application/usecases/delete-device.usecase';
import { DevicesRepository } from './features/public/devices/repositories/device.repository';
import { DevicesService } from './features/public/devices/application/device.service';
import { DevicesQueryRepository } from './features/public/devices/repositories/device.query.repository';
import { DelController } from './testing-all-data/testing.controller';
import { IsUserAlreadyExistConstraint } from './infrastructure/decorators/user-exist.decorator';
import { RegistrationConfirmCodeConstraint } from './infrastructure/decorators/registration-conformation.decorator';
import { RegistrationEmailResendingConstraint } from './infrastructure/decorators/registration-email-resending.decorator';
import { ConfigModule } from '@nestjs/config';
import { DeviceController } from './features/public/devices/api/device.controller';

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
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),

        ConfigModule.forRoot({ isGlobal: true }),
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
    controllers: [AppController, UserController, AuthController, DelController, DeviceController],
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
