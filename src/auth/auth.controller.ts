import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/entity/user.entity'
import { UserRole } from 'src/users/user-enum/user-role.enum'
import { AuthService } from './auth.service'
import { GetUser } from './decorator/get-user.decorator'
import { ChangePasswordDto } from './dtos/change-password.dto'
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

    @Patch('/update/token/:token')
    async confirmEmail(@Param('token') token: string): Promise<{ message: string }> {
        await this.authService.confirmEmail(token)
        return {
            message: 'E-mail confirmation',
        }
    }

    @Post('/send-recover-email')
    async sendRecoverPasswordEmail(@Body('email') email: string): Promise<{ message: string }> {
        await this.authService.sendRecoverPasswordEmail(email)
        return {
            message: 'An email has been sent with instructions to reset your password.',
        }
    }

    @Patch('/id:/reset-password')
    async resetPassword(
        @Param('id') id: string,
        @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
        @GetUser() user: User,
    ): Promise<{ message: string }> {
        if (user.role !== UserRole.ADMIN && user.id.toString() !== id)
            throw new UnauthorizedException('You are not allowed to perform this operation.')
        await this.authService.resetPassword(id, changePasswordDto)
        return {
            message: 'Password updated successfully.',
        }
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User): User {
        return user
    }
}
