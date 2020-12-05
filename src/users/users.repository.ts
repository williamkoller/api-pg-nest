import { EntityRepository, Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto } from './create-user.dto'
import { UserRole } from './user-role.enum'
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
        const { email, name, password } = createUserDto
        const user = this.create()
        user.email = email
        user.name = name
        user.role = role
        user.status = true
        user.confirmationToken = crypto.randomBytes(32).toString('hex')
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
            delete user.password
            delete user.salt
            return user
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('This e-mail already exists.')
            } else {
                throw new InternalServerErrorException('Error on save user Database.')
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}
