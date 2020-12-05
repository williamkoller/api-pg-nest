import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dtos'
import { UserRole } from './user-enum/user-role.enum'
import { User } from './entity/user.entity'
import { UserRepository } from './repository/users.repository'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

    async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('This password not matchs')
        } else {
            return this.userRepository.createUser(createUserDto, UserRole.ADMIN)
        }
    }
}
