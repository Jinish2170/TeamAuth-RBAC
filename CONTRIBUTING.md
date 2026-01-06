# Contributing to TeamAuth-RBAC

Thank you for considering contributing to TeamAuth-RBAC! This document provides guidelines for contributing to this project.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Detailed steps to reproduce the bug
- Expected behavior vs actual behavior
- Your environment (Node version, PostgreSQL version, OS)
- Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:
- A clear, descriptive title
- Detailed explanation of the proposed feature
- Why this enhancement would be useful
- Example use cases

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/teamauth-rbac.git
   cd teamauth-rbac
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test your changes**
   - Ensure the application runs without errors
   - Test all affected endpoints
   - Verify database operations work correctly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: feature description"
   # or
   git commit -m "Fix: bug description"
   ```

   **Commit message format:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with details

## Code Style Guidelines

### JavaScript/Node.js

- Use ES6+ features
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Use meaningful variable and function names

### File Structure

- Controllers handle business logic
- Routes define endpoints
- Middleware handles cross-cutting concerns
- Config files contain configuration only

### Security

- Never commit `.env` files
- Always use parameterized queries
- Validate all user inputs
- Hash passwords before storing
- Use JWT for authentication

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Setup database**
   ```bash
   psql -U postgres -c "CREATE DATABASE teamauth_db;"
   psql -U postgres -d teamauth_db -f src/scripts/setup_database.sql
   node src/scripts/migrate_passwords.js
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## Testing

Before submitting a PR:
- Test all API endpoints
- Verify role-based access control works
- Check error handling
- Test edge cases

## Documentation

- Update README.md if you add features
- Update DATABASE_SETUP.md if you change database schema
- Add comments to complex code
- Update API documentation for new endpoints

## Questions?

Feel free to open an issue for any questions about contributing!

---

Thank you for contributing to TeamAuth-RBAC! 🎉
