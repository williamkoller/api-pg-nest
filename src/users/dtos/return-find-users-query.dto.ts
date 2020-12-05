import { User } from '../entity/user.entity'

export class ReturnFindUsersQueryDto {
    found: { users: User[]; total: number }
    message: string
}
