# My Logger

An isomorphic logging library for Node.js and browsers with TypeScript support.

## Features

- 🌐 **Isomorphic**: Works in both Node.js and browser environments
- 📝 **TypeScript**: Full TypeScript support with type definitions
- 🔌 **Pluggable**: Extensible transport system
- 🎯 **Tree-shakable**: ESM and CJS builds with minimal bundle size
- ⚡ **Fast**: Optimized for performance

## Installation

```bash
npm install CargoLog
```

## Quick Start

```typescript
import { Logger } from "CargoLog";
import { ConsoleTransport } from "CargoLog/transports/console";

const logger = new Logger({
  transports: [new ConsoleTransport()],
});

logger.info("Hello, world!");
logger.error("Something went wrong", { error: new Error("Details") });
```

## API Documentation

### Logger

The main logger class that handles log messages and routes them to configured transports.

### Transports

- **ConsoleTransport**: Outputs logs to the console

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
