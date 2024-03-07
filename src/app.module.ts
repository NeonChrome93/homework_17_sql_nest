import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './features/users/api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './features/users/repositories/user-repository';
import { DeleteUserUseCase } from './features/users/application/usecases/delete-user.command';
import { CreateUserUseCase } from './features/users/application/usecases/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
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
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserRepository, DeleteUserUseCase, CreateUserUseCase],
})
export class AppModule {}
