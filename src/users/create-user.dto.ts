import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty({
        message: 'Enter an email address',
    })
    @IsEmail({}, { message: 'Enter a valid email address' })
    @MaxLength(200, { message: 'Ehe email address must be less than 200 characters' })
    email: string

    @IsNotEmpty({ message: 'Enter the user name' })
    @MaxLength(200, { message: 'The name must be less than 200 characters' })
    name: string

    @IsNotEmpty({ message: 'Enter password' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string

    @IsNotEmpty({ message: 'Enter password confirmation' })
    @MinLength(6, { message: 'Password confirmation must be at least 6 characters' })
    passwordConfirmation: string
}
