import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const TypeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'root',
    password: 'root',
    database: 'nest',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
}
