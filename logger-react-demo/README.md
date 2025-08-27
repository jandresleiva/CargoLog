# CargoLog React Demo

Interactive React demo showcasing [CargoLog](https://github.com/jandresleiva/CargoLog) logging capabilities with the HTTP transport plugin.

## Features

- **Dual Transport Setup**: Console logging for development + HTTP transport for remote logging
- **Interactive UI**: Test different log levels and see real-time output
- **Plugin Architecture**: Demonstrates CargoLog's plugin system with `@jandresleiva/cargolog-http-transport`
- **Browser Optimized**: Smart filtering (only warnings/errors sent to HTTP)
- **Real-time Visualization**: In-app log viewer with structured data display

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 to see the demo.

## What's Demonstrated

### Transport Configuration
- **Console Transport**: All log levels (debug+) displayed in browser console
- **HTTP Transport**: Warning and error levels sent to remote endpoint
- **Batching**: Automatic log batching for efficient network usage
- **Error Handling**: Graceful handling of network failures

### Interactive Features
- Click individual log level buttons to test specific levels
- Use "Emit all levels" to generate a complete log sequence
- "ERROR with stack" demonstrates error serialization
- Real-time log viewer shows structured log data
- Adjustable namespace and minimum log level filtering

### Plugin Integration
```typescript
import { Logger, ConsoleTransport } from '@jandresleiva/cargolog';
import { HttpTransport } from '@jandresleiva/cargolog-http-transport';

const logger = new Logger({
  level: 'debug',
  transports: [
    new ConsoleTransport('debug'),
    new HttpTransport({
      url: 'https://your-endpoint.com/logs',
      minLevel: 'warn',
      batchSize: 10
    })
  ]
});
```

## Built With

- **CargoLog**: Isomorphic logging library
- **React + TypeScript**: UI framework
- **Vite**: Build tool and dev server

## Related

- [CargoLog Core](https://github.com/jandresleiva/CargoLog) - Main logging library
- [HTTP Transport Plugin](https://www.npmjs.com/package/@jandresleiva/cargolog-http-transport) - HTTP transport for remote logging
- [Node.js Demo](../logger-node-demo) - Server-side CargoLog demo
