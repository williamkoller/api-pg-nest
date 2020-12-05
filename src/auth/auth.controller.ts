import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/entity/user.entity'
import { AuthService } from './auth.service'
import { GetUser } from './decorator/get-user.decorator'
import { CredentialsDto } from './dtos/credentials-dto'

@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ message: string }> {
        await this.authService.signUp(createUserDto)
        return {
            message: 'Successful registration.',
        }
    }

    @Post('/signin')
    async signIn(@Body(ValidationPipe) credentialsDto: CredentialsDto): Promise<{ token: string }> {
        return this.authService.signIn(credentialsDto)
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User): User {
        return user
    }
}
