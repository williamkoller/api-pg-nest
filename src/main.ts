import { NestFactory } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'
import { AppModule } from './app.module'
import { winstonConfig } from './configs/winston.config'

async function bootstrap() {
    const logger = WinstonModule.createLogger(winstonConfig)
    const app = await NestFactory.create(AppModule, { logger })
    await app.listen(3000)
}
bootstrap()
