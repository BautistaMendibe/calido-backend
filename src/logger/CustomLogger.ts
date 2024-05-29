const resolver = require('path').resolve;
const path = resolver('./logs');
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

const customFormat = combine(
  label({ label: 'Logging' }),
  timestamp(),
  printf((info) => {
    return `${info.timestamp} ${info.level}:${info.message}`;
  })
);
const logger = createLogger({
  format: customFormat,
  transports: [
    new transports.File({
      filename: `${path}/app-info.log`,
      level: 'info'
    }),
    new transports.File({
      filename: `${path}/app-error.log`,
      level: 'error'
    }),
    new transports.Console(),
    new DailyRotateFile({
      filename: `${path}/application-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '14d'
    })
  ],
  exceptionHandlers: [new transports.File({ filename: `${path}/app-exceptions.log` })]
});
export { logger };
