import { User } from '../entity/user.entity'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UserRole } from '../user-enum/user-role.enum'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { CredentialsDto } from 'src/auth/dtos/credentials-dto'
import { FindUsersQueryDto } from '../dtos/find-users.query.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[]; total: number }> {
        queryDto.status = queryDto.status === undefined ? true : queryDto.status
        queryDto.page = queryDto.page < 1 ? 1 : queryDto.page
        queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit

        const { email, name, role, status } = queryDto
        const query = this.createQueryBuilder('user')
        query.where('user.status = :status', { status })

        if (email) {
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` })
        }

        if (name) {
            query.andWhere('user.name ILIKE :name', { name: `%${name}%` })
        }

        if (role) {
            query.andWhere('user.role = :role', { role })
        }
        query.skip((queryDto.page - 1) * queryDto.limit)
        query.take(+queryDto.limit)
        query.orderBy(queryDto.sort ? JSON.stringify(queryDto.sort) : undefined)
        query.select(['user.name', 'user.email', 'user.role', 'user.status'])
        const [users, total] = await query.getManyAndCount()
        return {
            users,
            total,
        }
    }
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

    async changePassword(id: string, password: string): Promise<void> {
        const user = await this.findOne(id)
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        user.recoverToken = null
        await user.save()
    }

    async checkCredentials(credentilasDto: CredentialsDto): Promise<User> {
        const { email, password } = credentilasDto
        const user = await this.findOne({ email, status: true })

        if (user && (await user.checkPassword(password))) {
            return user
        } else {
            return null
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}
