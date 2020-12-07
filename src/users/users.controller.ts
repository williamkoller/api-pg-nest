import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto, ReturnUserDto } from './dtos'
import { UserRole } from './user-enum/user-role.enum'
import { UsersService } from './users.service'
import { Role } from 'src/auth/decorator/role.decorator'
import { RolesGuard } from 'src/auth/roles/roles.guard'
import { UpdateUserDto } from './dtos/update-users.dto'
import { GetUser } from 'src/auth/decorator/get-user.decorator'
import { User } from './entity/user.entity'
import { ReturnMessageDto } from './dtos/return-message.dto'
import { FindUsersQueryDto } from './dtos/find-users.query.dto'
import { ReturnFindUsersQueryDto } from './dtos/return-find-users-query.dto'

@Controller('api/v1/users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/admin/new')
    @Role(UserRole.ADMIN)
    async createUserAdmin(@Body(ValidationPipe) createUSerDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createAdminUser(createUSerDto)
        return {
            user,
            message: 'Admin user created with successfully',
        }
    }

    @Get('/admin/find-user-by-id/:id')
    @Role(UserRole.ADMIN)
    async findUserByID(@Param('id') id: string): Promise<ReturnUserDto> {
        const user = await this.usersService.findUserById(id)
        return {
            user,
            message: 'User found.',
        }
    }

    @Patch('/admin/edit/:id')
    async updateUser(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @GetUser() user: User,
        @Param('id') id: string,
    ): Promise<User> {
        if (user.role != UserRole.ADMIN && user.id.toString() != id) {
            throw new ForbiddenException('You do not have access to this feature.')
        } else {
            return this.usersService.updateUser(updateUserDto, id)
        }
    }

    @Delete('/admin/delete-user/:id')
    @Role(UserRole.ADMIN)
    async deleteUser(@Param('id') id: string): Promise<ReturnMessageDto> {
        await this.usersService.deleteUser(id)
        return {
            message: 'User removed successfully.',
        }
    }

    @Get('/admin/list-all')
    @Role(UserRole.ADMIN)
    async findUsers(@Query() query: FindUsersQueryDto): Promise<ReturnFindUsersQueryDto> {
        const found = await this.usersService.findUsers(query)
        return {
            found,
            message: 'Users found.',
        }
    }
}
