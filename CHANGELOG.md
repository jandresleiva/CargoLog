# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2025-08-27

### Added
- HTTP Transport integration in demo applications
- Data redaction capabilities for sensitive information protection
- Enhanced React demo with HTTP transport testing
- Enhanced Node.js demo with HTTP transport testing
- Comprehensive redaction examples for passwords, API keys, emails, and credit cards
- Batch logging demonstration with configurable batch sizes
- Real-world HTTP endpoint integration using Beeceptor for testing

### Changed
- Updated React demo to showcase HTTP transport with redaction features
- Updated Node.js demo to demonstrate HTTP transport capabilities
- Enhanced demo applications with better error handling and logging examples
- Improved documentation for transport usage patterns

### Technical Details
- React demo now includes HTTP transport with warn/error level filtering
- Node.js demo demonstrates batch processing and sensitive data redaction
- Both demos use test endpoints for HTTP log transmission
- Added comprehensive examples of redaction functions for various data types

## [1.0.2] - 2024-08-27

### Added
- Core logging functionality with TypeScript support
- Console transport implementation
- Plugin architecture for extensible transports
- Isomorphic design supporting both Node.js and browser environments
- Comprehensive demo applications (React and Node.js)
- Full TypeScript definitions and type safety
- Namespace support for modular logging
- Context enrichment capabilities
- Multiple log levels (trace, debug, info, warn, error, fatal)

### Infrastructure
- ESM and CommonJS dual package support
- Modern build system with tsup
- Development and production configurations
- Comprehensive project documentation

## [1.0.1] - Previous Release

### Added
- Initial release with basic logging capabilities

## [1.0.0] - Initial Release

### Added
- First stable release of CargoLog
- Basic logging infrastructure
- Console transport
- TypeScript support
