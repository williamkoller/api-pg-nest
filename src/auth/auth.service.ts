import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/entity/user.entity'
import { UserRepository } from 'src/users/repository/users.repository'
import { UserRole } from 'src/users/user-enum/user-role.enum'
import { CredentialsDto } from './dtos/credentials-dto'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(createdUserDto: CreateUserDto): Promise<User> {
        if (createdUserDto.password != createdUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('The passwods not matchs.')
        } else {
            return await this.userRepository.createUser(createdUserDto, UserRole.USER)
        }
    }

    async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
        const user = await this.userRepository.checkCredentials(credentialsDto)
        if (user === null) {
            throw new UnauthorizedException('Credentials invalids.')
        }

        const jwtPaylod = {
            id: user.id,
        }

        const token = this.jwtService.sign(jwtPaylod)

        return {
            token,
        }
    }
}
