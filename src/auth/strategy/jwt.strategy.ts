import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { User } from 'src/users/entity/user.entity'
import { UserRepository } from 'src/users/repository/users.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'super-secret',
        })
    }

    async validate(payload: { id: number }): Promise<User> {
        const { id } = payload
        const user = await this.userRepository.findOne(id, {
            select: ['name', 'email', 'status', 'role'],
        })
        if (!user) {
            throw new UnauthorizedException('User not found.')
        }
        return user
    }
}
