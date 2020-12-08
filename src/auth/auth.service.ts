import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/entity/user.entity'
import { UserRepository } from 'src/users/repository/users.repository'
import { UserRole } from 'src/users/user-enum/user-role.enum'
import { ChangePasswordDto } from './dtos/change-password.dto'
import { CredentialsDto } from './dtos/credentials-dto'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) {}

    async signUp(createdUserDto: CreateUserDto): Promise<User> {
        try {
            if (createdUserDto.password != createdUserDto.passwordConfirmation) {
                throw new UnprocessableEntityException('The passwods not matchs.')
            } else {
                const user = await this.userRepository.createUser(createdUserDto, UserRole.USER)

                const mail = {
                    to: user.email,
                    from: 'noreply@application.com',
                    subject: 'Email de confirmação',
                    template: 'email-confirmation',
                    context: {
                        token: user.confirmationToken,
                    },
                }
                await this.mailerService.sendMail(mail)
                return user
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error)
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

    async confirmEmail(confirmationToken: string): Promise<void> {
        const result = await this.userRepository.update(
            {
                confirmationToken,
            },
            {
                confirmationToken: null,
            },
        )
        if (result.affected === 0) throw new NotAcceptableException('token invalid.')
    }

    async sendRecoverPasswordEmail(email: string): Promise<void> {
        try {
            const user = await this.userRepository.findOne({ email })
            if (!user) {
                throw new NotFoundException('There is no user found with this email.')
            }

            user.recoverToken = randomBytes(32).toString('hex')
            await user.save()

            const mail = {
                to: user.email,
                from: 'noreply@application.com',
                subject: 'Recuperação de senha',
                template: 'recover-password',
                context: {
                    token: user.recoverToken,
                },
            }
            await this.mailerService.sendMail(mail)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error)
        }
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const { password, passwordConfirmation } = changePasswordDto
        if (password != passwordConfirmation) {
            throw new UnprocessableEntityException('The passwords not matchs.')
        }
        await this.userRepository.changePassword(id, password)
    }

    async resetPassword(recoverToken: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const user = await this.userRepository.findOne(
            {
                recoverToken: recoverToken ? recoverToken : null,
            },
            {
                select: ['id'],
            },
        )
        if (!user) throw new NotFoundException('Token invalid.')
        try {
            await this.changePassword(user.id.toString(), changePasswordDto)
        } catch (error) {
            throw error
        }
    }
}
