import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto, ReturnUserDto } from './dtos'
import { UserRole } from './user-enum/user-role.enum'
import { UsersService } from './users.service'
import { Role } from 'src/auth/decorator/role.decorator'
import { RolesGuard } from 'src/auth/roles/roles.guard'

@Controller('api/v1/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/admin/new')
    @Role(UserRole.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async createUserAdmin(@Body(ValidationPipe) createUSerDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createAdminUser(createUSerDto)
        return {
            user,
            message: 'Admin user created with successfully',
        }
    }
}
