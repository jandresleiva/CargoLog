# CargoLog Node.js Demo

Node.js demo showcasing [CargoLog](https://github.com/jandresleiva/CargoLog) server-side logging with the HTTP transport plugin.

## Features

- **Dual Transport Setup**: Console logging for development + HTTP transport for remote logging
- **Server-Side Logging**: Demonstrates CargoLog in Node.js environment
- **Plugin Architecture**: Shows CargoLog's plugin system with `@jandresleiva/cargolog-http-transport`
- **Batch Processing**: Automatic log batching for efficient network transmission
- **Error Serialization**: Complete error stack trace capture and transmission
- **Structured Context**: Rich contextual data with each log entry

## Quick Start

```bash
npm install
npm start
```

## What's Demonstrated

### Transport Configuration
- **Console Transport**: All log levels (debug+) displayed in terminal
- **HTTP Transport**: Info+ levels sent to remote endpoint with batching
- **Smart Filtering**: Debug messages stay local, important logs go remote
- **Custom Headers**: Application identification and versioning

### Logging Features
- **Multiple Log Levels**: trace, debug, info, warn, error, fatal
- **Error Handling**: Automatic error serialization with stack traces
- **Structured Context**: Rich metadata attached to log entries
- **Namespace Support**: Organized logging with `node-demo` namespace
- **Batch Triggering**: Demonstrates automatic batch sending (5 log threshold)

### Code Example
```typescript
import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const logger = new Logger({
  level: 'debug',
  transports: [
    new ConsoleTransport('debug'),
    new HttpTransport({
      url: 'https://your-endpoint.com/logs',
      minLevel: 'info',
      batchSize: 5,
      timeout: 10000,
      headers: {
        'X-Demo-App': 'CargoLog-Node-Demo',
        'X-Version': '1.0.0'
      }
    })
  ],
  namespace: 'node-demo',
  context: { env: 'development', version: '1.0.0' }
});

// Usage
logger.info('Application started');
logger.error('Something went wrong', { 
  err: new Error('Demo error'),
  context: { userId: 'user123' }
});

// Ensure all logs are sent before exit
await logger.flush();
await logger.close();
```

## Demo Flow

1. **Initialization**: Sets up dual transport configuration
2. **Log Generation**: Creates various log levels with structured data
3. **Batch Demonstration**: Generates enough logs to trigger HTTP batching
4. **Error Logging**: Shows error serialization with stack traces
5. **Graceful Shutdown**: Flushes remaining logs before exit

## Output

- **Terminal**: Formatted console output with timestamps and structured data
- **HTTP Endpoint**: Batched JSON logs sent to remote endpoint
- **Network Inspection**: Check the configured endpoint for received logs

## Built With

- **CargoLog**: Isomorphic logging library
- **Node.js**: Server-side JavaScript runtime
- **TypeScript**: Type-safe development
- **tsx**: TypeScript execution engine

## Related

- [CargoLog Core](https://github.com/jandresleiva/CargoLog) - Main logging library
- [HTTP Transport Plugin](https://www.npmjs.com/package/@jandresleiva/cargolog-http-transport) - HTTP transport for remote logging
- [React Demo](../logger-react-demo) - Browser-side CargoLog demo
