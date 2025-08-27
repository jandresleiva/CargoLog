# Contributing to CargoLog

Thank you for your interest in contributing to CargoLog! We welcome contributions of all kinds, from bug reports and feature requests to code contributions and documentation improvements.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Creating Transports](#creating-transports)
- [Testing](#testing)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Git

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/jandresleiva/CargoLog.git
   cd CargoLog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run tests**
   Coming soon!

   ```bash
   npm test
   ```

5. **Test in demo projects**

   ```bash
   # Test Node.js integration
   cd logger-node-demo
   npm install
   npm run start

   # Test React integration
   cd ../logger-react-demo
   npm install
   npm run dev
   ```

## Project Structure

```
├── src/                    # Core library source code
│   ├── transports/         # Built-in transport implementations
│   │   └── console.ts      # Console transport
│   ├── index.ts           # Main exports
│   ├── logger.ts          # Logger implementation
│   ├── types.ts           # TypeScript interfaces
│   └── plugins.ts         # Plugin system
├── plugins/                # External transport plugins
│   ├── cargolog-http-transport/  # HTTP transport plugin
│   └── README.md          # Plugin development guide
├── logger-react-demo/      # React demo application
├── logger-node-demo/       # Node.js demo application
├── dist/                  # Built output (generated)
└── docs/                  # Documentation
```

## Contributing Guidelines

### Types of Contributions

1. **Bug Reports**: Use GitHub Issues with the bug template
2. **Feature Requests**: Use GitHub Issues with the feature template
3. **Code Contributions**: Submit Pull Requests
4. **Documentation**: Improve README, guides, or inline documentation
5. **Transport Packages**: Create new transport implementations

### Before You Start

- Check existing issues and PRs to avoid duplicates
- For major changes, open an issue first to discuss the approach
- Ensure your contribution aligns with the project's goals

## Creating Transports

CargoLog follows a modular transport architecture. New transports should be created as separate npm packages to keep the core library lightweight.

### Transport Package Guidelines

1. **Package Naming**: Use the pattern `@jandresleiva/cargolog-{transport-name}-transport`
2. **Location**: Develop plugins in the `plugins/` directory
3. **Dependencies**: Depend on `@jandresleiva/cargolog` as a peer dependency
4. **TypeScript**: Include full TypeScript support with `.d.ts` files
5. **Testing**: Include comprehensive tests
6. **Documentation**: Provide clear usage examples
7. **Features**: Consider implementing redaction capabilities for sensitive data protection

### Transport Implementation Checklist

- [ ] Implements the `Transport` interface correctly
- [ ] Handles errors gracefully
- [ ] Supports async operations properly
- [ ] Includes `minLevel` filtering
- [ ] Implements `flush()` and `close()` when applicable
- [ ] Supports data redaction for sensitive information (optional)
- [ ] Has comprehensive tests
- [ ] Includes TypeScript definitions
- [ ] Has clear documentation with examples

### Example Transport Structure

```
plugins/cargolog-{transport-name}-transport/
├── src/
│   ├── index.ts           # Main transport implementation
│   └── types.ts           # Transport-specific types
├── tests/
│   └── index.test.ts      # Test suite
├── package.json
├── README.md
├── tsconfig.json
└── tsup.config.ts         # Build configuration
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Requirements

Not for now, but we will be including this requirement soon!

- **Unit Tests**: All new features must include unit tests
- **Integration Tests**: Test transport integrations with the logger
- **Type Tests**: Ensure TypeScript types are correct
- **Browser Tests**: For browser-compatible features

### Writing Tests

```typescript
import { describe, it, expect } from "vitest";
import { Logger } from "../src/logger";
import { InMemoryTransport } from "./helpers/in-memory-transport";

describe("Logger", () => {
  it("should log messages to transports", () => {
    const transport = new InMemoryTransport();
    const logger = new Logger({
      level: "info",
      transports: [transport],
    });

    logger.info("Test message");

    expect(transport.logs).toHaveLength(1);
    expect(transport.logs[0].msg).toBe("Test message");
  });
});
```

## Code Style

### Formatting

We use Prettier for code formatting. Run before committing:

```bash
npm run format
```

### Linting

We use ESLint for code quality. Fix issues with:

```bash
npm run lint:fix
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Prefer interfaces over types for public APIs
- Use meaningful names for generic type parameters
- Include JSDoc comments for public APIs

```typescript
/**
 * Creates a new logger instance with the specified configuration.
 * @param config - Logger configuration options
 * @returns A new Logger instance
 */
export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config);
}
```

### Code Conventions

- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and interfaces
- Use `UPPER_SNAKE_CASE` for constants
- Prefer `const` over `let` when possible
- Use descriptive variable names

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write clean, tested code
   - Follow the code style guidelines
   - Update documentation as needed

3. **Test your changes**

   ```bash
   npm run build
   npm test
   npm run lint
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new transport feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(transport): add file transport implementation
fix(logger): handle undefined context gracefully
docs(readme): update installation instructions
```

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Clearly document any breaking changes
- **Screenshots**: Include screenshots for UI changes

## Release Process

### Version Management

We use semantic versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped appropriately
- [ ] Git tag is created
- [ ] Package is published to npm

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: leivajandres@gmail.com for private matters

## Recognition

Contributors will be recognized in:

- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub releases notes

Thank you for contributing to CargoLog! 🚀
