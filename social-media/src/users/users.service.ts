import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private users: User[] = []

  create(createUserDto: CreateUserDto) {
    const _user = this.users.find(user => user.email === createUserDto.email)
    if (_user) {
      throw new BadRequestException("Email already exist")
    }
    const user = new User()
    user.id = randomUUID()
    user.email = createUserDto.email
    user.password = `#${createUserDto.password}#`
    user.username = createUserDto.username
    this.users.push(user)

    const { password, ...response } = user
    return response
  }

  findAll() {
    return this.users.map(({ password, ...user }) => user);
  }

  findOne(id: string) {
    const _user = this.users.find(user => user.id === id)
    if (!_user) {
      throw new NotFoundException("User not found")
    }
    const { password, ...user } = _user
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) {
      throw new NotFoundException("User not found")
    }
    const user = { ...this.users[index] }
    const newUser = { ...user, ...updateUserDto, id: user.id }
    this.users[index] = newUser

    const { password, ...response } = newUser
    return response
  }

  remove(id: string) {
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) {
      throw new NotFoundException("User not found")
    }
    const _user = this.users.splice(index)[0]
    const { password, ...user } = _user
    return user
  }
}
