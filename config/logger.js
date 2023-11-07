import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, json, errors, prettyPrint, printf } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
  // return `${timestamp} [${label}] ${level}: ${message}`;
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  levels: config.syslog.levels,
  exitOnError: false,
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    json(),
    prettyPrint(),
    loggerFormat
  ),
  transports: [new transports.Console()],
  exceptionHandlers: [new transports.Console()],
});

export default logger;
