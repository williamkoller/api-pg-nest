import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { CreateUserDto, ReturnUserDto } from './dtos'
import { UsersService } from './users.service'

@Controller('api/v1/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async createUserAdmin(@Body(ValidationPipe) createUSerDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createAdminUser(createUSerDto)
        return {
            user,
            message: 'Admin user created with successfully',
        }
    }
}
