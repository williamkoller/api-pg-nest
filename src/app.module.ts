import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeORMConfig } from './configs/typeorm.config'
import { UsersModule } from './users/users.module'

@Module({
    imports: [TypeOrmModule.forRoot(TypeORMConfig), UsersModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
