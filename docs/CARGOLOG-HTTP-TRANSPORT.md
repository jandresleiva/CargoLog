# CargoLog HTTP Transport

A plugin transport for [CargoLog](https://github.com/jandresleiva/CargoLog) that sends log records to an HTTP endpoint.

## Installation

```bash
npm install @jandresleiva/cargolog-http-transport
```

## Usage

```typescript
import { Logger } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const logger = new Logger({
  level: 'info',
  transports: [
    new HttpTransport({
      url: 'https://your-log-server.com/api/logs',
      minLevel: 'warn',
      batchSize: 50,
      timeout: 10000,
      headers: {
        'Authorization': 'Bearer your-token'
      }
    })
  ]
});

logger.info('This will be sent to your HTTP endpoint');
```

## Options

- `url` (required): The HTTP endpoint to send logs to
- `minLevel`: Minimum log level to send (defaults to transport all levels)
- `batchSize`: Number of log records to batch before sending (default: 100)
- `timeout`: Request timeout in milliseconds (default: 5000)
- `headers`: Additional HTTP headers to send with requests
- `redact`: Function to redact sensitive data before sending to HTTP endpoint

## Features

- **Batching**: Automatically batches log records for efficient transmission
- **Error Handling**: Gracefully handles network failures without breaking your application
- **Timeout Protection**: Prevents hanging requests with configurable timeouts
- **Custom Headers**: Support for authentication and custom headers
- **Data Redaction**: Redact sensitive information before sending to HTTP endpoints
- **TypeScript**: Full TypeScript support with proper type definitions

## Data Redaction

Protect sensitive information by redacting data before it's sent to your HTTP endpoint:

```typescript
import { Logger } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const logger = new Logger({
  level: 'info',
  transports: [
    new HttpTransport({
      url: 'https://your-log-server.com/api/logs',
      redact: (key, value) => {
        // Redact sensitive fields
        if (key === 'password' || key === 'token' || key === 'apiKey') {
          return '[REDACTED]';
        }
        // Mask email addresses
        if (key === 'email' && typeof value === 'string') {
          return value.replace(/(.{2}).*@/, '$1***@');
        }
        // Truncate long stack traces
        if (key === 'stack' && typeof value === 'string') {
          return value.split('\n').slice(0, 5).join('\n') + '\n...';
        }
        return value;
      }
    })
  ]
});

// Usage - sensitive data will be redacted before HTTP transmission
logger.info('User login', { 
  email: 'user@example.com',  // becomes 'us***@example.com'
  password: 'secret123'       // becomes '[REDACTED]'
});
```

## License

MIT
