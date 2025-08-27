# CargoLog Plugin Architecture

CargoLog supports a plugin architecture that allows transports to be shipped as separate npm packages. This enables a plug-and-play ecosystem where developers can create and share custom transports.

## Core Concepts

### Transport Interface

All transport plugins must implement the `Transport` interface:

```typescript
interface Transport {
  minLevel?: LogLevel;
  write(record: LogRecord): void | Promise<void>;
  flush?(): Promise<void>;
  close?(): Promise<void>;
}
```

### Plugin Package Structure

Transport plugins should be structured as separate npm packages with:

- CargoLog as a peer dependency
- Import types from `@jandresleiva/cargolog`
- Follow the naming convention `@jandresleiva/cargolog-{transport-name}-transport`

## Creating a Transport Plugin

### 1. Package Setup

```json
{
  "name": "@jandresleiva/cargolog-{transport-name}-transport",
  "peerDependencies": {
    "@jandresleiva/cargolog": "^1.0.0"
  }
}
```

### 2. Implementation

```typescript
import { Transport, LogRecord, LogLevel } from "@jandresleiva/cargolog";

export class YourTransport implements Transport {
  constructor(public minLevel?: LogLevel) {}

  write(record: LogRecord): void {
    // Your transport logic here
  }

  async flush(): Promise<void> {
    // Optional: flush any buffered records
  }

  async close(): Promise<void> {
    // Optional: cleanup resources
  }
}
```

### 3. Usage

```typescript
import { Logger } from "@jandresleiva/cargolog";
import { YourTransport } from "@jandresleiva/cargolog-your-transport";

const logger = new Logger({
  level: "info",
  transports: [new YourTransport()],
});
```

## Available Transport Plugins

### Built-in Transports

- **ConsoleTransport**: Ships with CargoLog core for console output

### Community Transports

- **HttpTransport** (`@jandresleiva/cargolog-http-transport`): Send logs to HTTP endpoints

## Benefits

- **Modularity**: Only install the transports you need
- **Extensibility**: Easy to create custom transports for specific needs
- **Type Safety**: Full TypeScript support across all plugins
- **Independence**: Transport packages can be versioned and updated independently
- **Community**: Enables a rich ecosystem of community-contributed transports

## Future Transport Ideas

- File transport for local logging
- Database transports (PostgreSQL, MongoDB, etc.)
- Cloud service transports (AWS CloudWatch, Google Cloud Logging, etc.)
- Message queue transports (Redis, RabbitMQ, etc.)
- Monitoring service transports (Datadog, New Relic, etc.)
