# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript project built with Vite for the "kaia-hackaton" (hackathon). The project uses modern web development tools and follows established best practices.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS v3** - Utility-first CSS framework
- **Zustand** - State management solution
- **Framer Motion** - Animation library

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking (included in build)
tsc -b
```

## Project Structure

```
/src
  /components     # Reusable React components
  /hooks         # Custom React hooks
  /store         # Zustand store definitions
  /types         # TypeScript type definitions
  /utils         # Utility functions
  App.tsx        # Main application component
  main.tsx       # Application entry point
  index.css      # Global styles with Tailwind directives
```

## Code Guidelines

### From .cursor/rules:

**Clean Code Principles:**
- Use constants over magic numbers
- Write self-documenting code with meaningful names
- Single responsibility for functions
- DRY (Don't Repeat Yourself)
- Extract reusable logic into custom hooks

**React Best Practices:**
- Use functional components exclusively
- Implement proper TypeScript prop types
- Use custom hooks for reusable logic
- Proper memoization with useMemo and useCallback
- Handle errors with Error Boundaries

**TypeScript Conventions:**
- Prefer interfaces for object types
- Use PascalCase for types/interfaces
- Use camelCase for variables/functions
- Avoid `any`, use `unknown` for unknown types
- Enable strict mode in tsconfig

**Tailwind CSS:**
- Use utility classes over custom CSS
- Mobile-first responsive design
- Semantic color naming in config
- Group utilities with @apply sparingly

**State Management (Zustand):**
- Create typed store slices
- Use selectors for performance
- Keep stores focused and small
- Implement proper TypeScript types

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `postcss.config.js` - PostCSS configuration for Tailwind
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `eslint.config.js` - ESLint configuration

## Library Links
- [Tailwind CSS V3 Documentation](https://v3.tailwindcss.com/docs/installation)
- [Framer Motion React Documentation](https://motion.dev/docs/react)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev/)

## Notes

- The project follows strict TypeScript configuration
- CSS uses Tailwind utility classes with custom theme colors
- State management uses Zustand for simplicity and performance
- Animations handled through Framer Motion
- Development server runs on http://localhost:5173 by default