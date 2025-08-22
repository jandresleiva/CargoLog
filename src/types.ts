export type LogLevel = 'trace'|'debug'|'info'|'warn'|'error'|'fatal';

export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
}

export interface LogRecord {
  level: LogLevel;
  msg: string;
  time: number;
  ns?: string; // namespace
  context?: Record<string, unknown>;
  err?: SerializedError;
}

export interface Transport {
  minLevel?: LogLevel;
  write(record: LogRecord): void | Promise<void>;
  flush?(): Promise<void>;
  close?(): Promise<void>;
}

export interface LoggerConfig {
  level: LogLevel;
  namespace?: string;
  redact?: (key: string, value: unknown) => unknown;
  context?: Record<string, unknown>;
  transports: Transport[];
}