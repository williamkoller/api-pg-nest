import { BaseQueryParametersDto } from 'src/share/base-query-parameters.dto'

export class FindUsersQueryDto extends BaseQueryParametersDto {
    name: string
    email: string
    status: boolean
    role: string
}
