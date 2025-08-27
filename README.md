# CargoLog

A lightweight isomorphic logging library with custom transports support for Node.js and browsers TypeScript native.

## Features

- 🌐 **Isomorphic**: Works in both Node.js and browser environments
- 📝 **TypeScript**: Full TypeScript support with type definitions
- 🔌 **Pluggable**: Extensible transport system
- 🎯 **Tree-shakable**: ESM and CJS builds with minimal bundle size
- ⚡ **Fast**: Optimized for performance

## Installation

```bash
npm install @jandresleiva/cargolog
```

## Quick Start

```typescript
import { Logger } from "@jandresleiva/cargolog";
import { ConsoleTransport } from "@jandresleiva/cargolog/transports/console";

const logger = new Logger({
  transports: [new ConsoleTransport()],
});

logger.info("Hello, world!");
logger.error("Something went wrong", { error: new Error("Details") });
```

## API Documentation

### Logger

The main logger class that handles log messages and routes them to configured transports.

### Built-in Transports

- **ConsoleTransport**: Outputs logs to the console with timestamp and formatting

### Available Transport Plugins

- **HttpTransport** (`@jandresleiva/cargolog-http-transport`): Send logs to HTTP endpoints with batching, timeout protection, and custom headers

```bash
npm install @jandresleiva/cargolog-http-transport
```

```typescript
import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const logger = new Logger({
  level: 'info',
  transports: [
    new ConsoleTransport(),
    new HttpTransport({
      url: 'https://your-log-server.com/api/logs',
      minLevel: 'warn',
      batchSize: 100,
      timeout: 5000,
      headers: {
        'Authorization': 'Bearer your-token'
      }
    })
  ]
});
```

## Custom Transports

CargoLog supports custom transports by implementing the `Transport` interface. This allows you to send logs to files, databases, external services, or any destination you need.

Transport plugins are shipped as separate npm packages to keep the core library lightweight while allowing users to install only the transports they need.

### Transport Interface

```typescript
interface Transport {
  minLevel?: LogLevel; // Optional minimum log level filter
  write(record: LogRecord): void | Promise<void>; // Required: handle log records
  flush?(): Promise<void>; // Optional: flush pending logs
  close?(): Promise<void>; // Optional: cleanup resources
}
```

### LogRecord Structure

```typescript
interface LogRecord {
  level: LogLevel; // 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  msg: string; // Log message
  time: number; // Timestamp (milliseconds)
  ns?: string; // Namespace (optional)
  context?: Record<string, unknown>; // Additional context data
  err?: SerializedError; // Serialized error object (if any)
}
```

### Example: File Transport (Node.js)

```typescript
import { Transport, LogRecord } from "@jandresleiva/cargolog";
import { writeFile, appendFile } from "fs/promises";

export class FileTransport implements Transport {
  constructor(private filePath: string, public minLevel: LogLevel = "info") {}

  async write(record: LogRecord): Promise<void> {
    const timestamp = new Date(record.time).toISOString();
    const namespace = record.ns ? `[${record.ns}]` : "";
    const extras =
      record.context || record.err
        ? ` ${JSON.stringify({
            ...record.context,
            ...(record.err ? { err: record.err } : {}),
          })}`
        : "";

    const logLine = `${timestamp} ${record.level.toUpperCase()} ${namespace} ${
      record.msg
    }${extras}\n`;

    await appendFile(this.filePath, logLine);
  }

  async flush(): Promise<void> {
    // File system automatically flushes, but you could implement buffering here
  }

  async close(): Promise<void> {
    // Cleanup if needed (close file handles, etc.)
  }
}

// Usage
import { Logger } from "@jandresleiva/cargolog";

const logger = new Logger({
  level: "debug",
  transports: [
    new FileTransport("./app.log", "info"),
    new ConsoleTransport("debug"),
  ],
});
```

### Example: In-Memory Transport (for testing)

```typescript
import { Transport, LogRecord } from "@jandresleiva/cargolog";

export class InMemoryTransport implements Transport {
  public logs: LogRecord[] = [];

  constructor(public minLevel: LogLevel = "trace") {}

  write(record: LogRecord): void {
    this.logs.push({ ...record });
  }

  clear(): void {
    this.logs = [];
  }

  getLogsByLevel(level: LogLevel): LogRecord[] {
    return this.logs.filter((log) => log.level === level);
  }
}

// Usage in tests
const memoryTransport = new InMemoryTransport();
const logger = new Logger({
  level: "debug",
  transports: [memoryTransport],
});

logger.info("Test message");
console.log(memoryTransport.logs); // [{ level: 'info', msg: 'Test message', ... }]
```

### Transport Best Practices

1. **Error Handling**: Always handle errors gracefully in your transport
2. **Async Operations**: Use `async/await` for I/O operations
3. **Buffering**: Consider buffering for performance with external services
4. **Resource Cleanup**: Implement `close()` to clean up resources
5. **Level Filtering**: Use `minLevel` to filter logs at the transport level
6. **Performance**: Avoid blocking operations in the `write()` method

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
