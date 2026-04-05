/* eslint-disable no-console */
import { asError } from "@/shared/utils";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogContext {
  [key: string]: unknown;
}

export interface LoggerConfig {
  userId?: string;
  companyId?: string;
  [key: string]: unknown;
  isLocal: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (this.config.isLocal) {
      switch (level) {
        case "debug":
          console.debug(message, context);
          break;
        case "info":
          console.info(message, context);
          break;
        case "warn":
          console.warn(message, context);
          break;
        case "error":
          console.error(message, context);
          break;
        default:
          break;
      }
    } else {
      // TODO: Log to Sentry later
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(error?: unknown, context?: LogContext): void {
    this.log(LogLevel.ERROR, asError(error).message, context);
  }
}

export { Logger };
export const createLogger = (config: LoggerConfig): Logger => new Logger(config);

export const logger = createLogger({
  isLocal: process.env.NEXT_PUBLIC_ENV === "local",
});
