import winston from "winston";
import { Constants } from "./";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    success: "green",
    info: "blue",
    debug: "gray",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()} ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: Constants.OUTPUT_LOGS.toString(),
      level: "debug",
    }),

    new winston.transports.Console({
      level: "success",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level.toUpperCase()} ${message}`;
        })
      ),
    }),
  ],
});

export function log(
  level: "info" | "warn" | "error" | "success" | "debug",
  message: string
) {
  logger.log({ level, message });
}
