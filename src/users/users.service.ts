import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dtos'
import { UserRole } from './user-enum/user-role.enum'
import { User } from './entity/user.entity'
import { UserRepository } from './repository/users.repository'
import { UpdateUserDto } from './dtos/update-users.dto'
import { FindUsersQueryDto } from './dtos/find-users-query.dto'

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

    async findUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne(userId, {
            select: ['email', 'name', 'role', 'id'],
        })
        if (!user) throw new NotFoundException('User not found.')
        return user
    }

    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
        const user = await this.findUserById(id)
        const { name, email, role, status } = updateUserDto
        user.name = name ? name : user.name
        user.email = email ? email : user.email
        user.role = role ? role : user.role
        user.status = status === undefined ? user.status : status
        try {
            await user.save()
            return user
        } catch (error) {
            throw new InternalServerErrorException('Error on save data in Database.')
        }
    }

    async deleteUser(userId: string): Promise<void> {
        const result = await this.userRepository.delete({ id: userId })
        if (result.affected === 0) {
            throw new NotFoundException('The user with the given id was not found.')
        }
    }

    async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[]; total: number }> {
        const users = await this.userRepository.findUsers(queryDto)
        return users
    }
}
