const winston = require('winston');

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'magenta',
        debug: 'white'
    }
};

winston.addColors(customLevelOptions.colors);

const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename: './info.log',
            level: 'info',
            format: winston.format.simple()
        })
    ]
});

const addLogger = (req, res, next) => {
    // req.logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;
    // no funciona el ternario para elegir el modo 
    req.logger = productionLogger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next()
}

module.exports = { addLogger , productionLogger }