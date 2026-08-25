# Type Definitions

This folder exists to provide global type definitions.

## Guidelines
1. **Explicit Imports:** We do not use auto-imports for types. Please use `import type { ... } from '@app-types/...'` at the top of your files.
2. **Shared Types:** If a type is used in multiple files, then it's definition belongs here.
3. **Naming Convention:** Use PascalCase for all types and interfaces (e.g., `UserProfile`).
4. **Avoid `.d.ts`:** Prefer standard `.ts` files to ensure visibility and easy "Go to Definition" navigation.
