import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  UserCreateModelDto,
  UsersQueryType,
} from './models/input/user.input.model';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.command';

@Controller('users')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  async getUsers(@Query() queryDto: UsersQueryType) {
    // const pagination = getQueryPagination(queryDto);
    // const arr = await this.usersQueryRepository.getUsers(pagination);
    //SQL выбровка уже идет
    //  return arr;
  }

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async createUser(@Body() userDto: UserCreateModelDto) {
    const newUser = await this.commandBus.execute(
      new CreateUserCommand(userDto),
    );
    return newUser;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteUserById(@Param('id') userId: string) {
    const idDeleted = this.commandBus.execute(new DeleteUserCommand(userId));
    if (!idDeleted) {
      throw new NotFoundException('user not found');
    } else return idDeleted;
  }
}
