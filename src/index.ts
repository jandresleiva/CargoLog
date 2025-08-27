export * from './logger';
export * from './types';
export * from './plugins';
export { ConsoleTransport } from './transports/console';

// Export types specifically for plugin development
export type { Transport, LogRecord, LogLevel, SerializedError } from './types';
