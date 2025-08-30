# CargoLog Transport Plugins

This directory contains external transport plugins for CargoLog. Each plugin is a separate npm package that can be installed independently.

## Available Plugins

### Official Plugins

- **[cargolog-http-transport](./cargolog-http-transport/)** - Send logs to HTTP endpoints with batching, redaction, and error handling

### Community Plugins

*Community-contributed plugins will be listed here*

## Plugin Development

### Creating a New Transport Plugin

1. **Create Plugin Directory**
   ```bash
   mkdir plugins/cargolog-{transport-name}-transport
   cd plugins/cargolog-{transport-name}-transport
   ```

2. **Initialize Package**
   ```bash
   npm init -y
   ```

3. **Install Dependencies**
   ```bash
   npm install --save-dev @jandresleiva/cargolog typescript tsup rimraf
   npm install --save-peer @jandresleiva/cargolog
   ```

4. **Implement Transport Interface**
   ```typescript
   import { Transport, LogRecord, LogLevel } from '@jandresleiva/cargolog';

   export class YourTransport implements Transport {
     constructor(public minLevel?: LogLevel) {}
     
     write(record: LogRecord): void {
       // Your transport logic here
     }
     
     async flush?(): Promise<void> {
       // Optional: flush pending logs
     }
     
     async close?(): Promise<void> {
       // Optional: cleanup resources
     }
   }
   ```

### Plugin Requirements

- Must implement the `Transport` interface
- Should include TypeScript definitions
- Must have CargoLog as a peer dependency
- Should include comprehensive documentation
- Should include examples and tests

### Publishing Guidelines

1. **Package Naming**: `@jandresleiva/cargolog-{transport-name}-transport`
2. **Versioning**: Follow semantic versioning
3. **Documentation**: Include README with usage examples
4. **Testing**: Include unit tests for transport functionality

## Plugin Ideas

### Potential Transport Plugins

- **File Transport**: Write logs to local files with rotation
- **Database Transports**: 
  - PostgreSQL transport
  - MongoDB transport
  - Redis transport
- **Cloud Service Transports**:
  - AWS CloudWatch transport
  - Google Cloud Logging transport
  - Azure Monitor transport
- **Monitoring Service Transports**:
  - Datadog transport
  - New Relic transport
  - Splunk transport
- **Message Queue Transports**:
  - RabbitMQ transport
  - Apache Kafka transport
  - AWS SQS transport

## Contributing

1. Fork the repository
2. Create your plugin in the `plugins/` directory
3. Follow the plugin development guidelines
4. Add your plugin to this README
5. Submit a pull request

## Support

For plugin development support, please:
- Check the [Plugin Architecture Documentation](../PLUGIN_ARCHITECTURE.md)
- Review existing plugin implementations
- Open an issue for questions or feature requests
