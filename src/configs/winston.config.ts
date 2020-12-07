import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston'
import * as winston from 'winston'

export const winstonConfig: WinstonModuleOptions = {
    levels: winston.config.npm.levels,
    level: 'verbose',
    defaultMeta: {
        APP: 'API Pg Nest',
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
                winston.format.colorize({ all: true }),
                winston.format.printf((msg) => {
                    return `${msg.timestamp} [${msg.level}] - ${msg.message}`
                }),
            ),
        }),
        new winston.transports.File({
            level: 'verbose',
            filename: 'application.log',
            dirname: 'logs',
        }),
    ],
}
