import { IsEmail, IsOptional, IsString } from 'class-validator'
import { UserRole } from '../user-enum/user-role.enum'

export class UpdateUserDto {
    @IsOptional()
    @IsString({
        message: 'Please provide a valid username.',
    })
    name: string

    @IsOptional()
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    email: string

    @IsOptional()
    role: UserRole

    @IsOptional()
    status: boolean
}
