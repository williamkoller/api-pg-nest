import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeORMConfig } from './configs/typeorm.config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [TypeOrmModule.forRoot(TypeORMConfig), UsersModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
