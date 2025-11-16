# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SheepAI Zagreb 2025 is a Next.js application with Clerk authentication, internationalization (i18n), and PostgreSQL database integration via Neon and Drizzle ORM.

## Tech Stack

- **Framework**: Next.js 16 with React 19.2
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1, Radix UI components
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Clerk
- **Internationalization**: next-intl
- **Package Manager**: Bun
- **Linting/Formatting**: Biome 2.3.5

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Code linting and formatting (fixes issues automatically)
bun check

# Generate database migrations from schema
bun db:generate

# Run database migrations
bun db:migrate
```

## Project Rules (from .cursor/rules/project.mdc)

- Use Bun as the package manager and for all commands
- Type all components with `React.FC`
- Component props must always be called `Props` (unless exported)
- Do not override existing shadcn components when installing new ones
- Never hardcode text in components—use the translations file (`src/messages/en.json`) instead
- Always declare a const `t` for the `useTranslations()` hook; don't use other names
- Prefer arrow functions over function declarations

## Code Architecture

### Directory Structure

```
src/
├── app/              # Next.js App Router pages
├── actions/          # Server actions (RSC with "use server")
├── components/       # React components
│   ├── ui/          # shadcn/radix UI components (excluded from linting)
│   ├── organisms/   # Complex multi-component layouts
│   ├── molecules/   # Reusable component groups
│   └── animate-ui/  # Animation-related components
├── db/              # Database layer
│   ├── schema.ts    # Drizzle ORM table definitions
│   ├── index.ts     # Database client setup
│   ├── migrate.ts   # Migration runner
│   └── migrations/  # Generated migration files
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization setup
├── messages/        # Translation files (currently en.json)
├── lib/             # Utility functions and helpers
└── assets/          # Static assets
```

### Key Components

- **Database**: `src/db/index.ts` exports the Drizzle `db` client and schema. Uses Neon serverless driver for PostgreSQL via `@neondatabase/serverless`.
- **Authentication**: Integrated via Clerk at the root layout (`src/app/layout.tsx`)
- **Layouts**: `ConditionalLayout` component handles layout rendering based on auth state
- **Translations**: `NextIntlClientProvider` wraps the app for i18n support

### Database Schema

Currently defined in `src/db/schema.ts`:
- **testItems** table: test data with `id`, `name`, `count`, `isActive`, `createdAt`, `updatedAt`

### Configuration Files

- **next.config.ts**: Enables React Compiler and next-intl plugin
- **tsconfig.json**: Strict mode enabled, path alias `@/*` → `./src/*`
- **drizzle.config.ts**: PostgreSQL dialect, migrations in `src/db/migrations`, schema from `src/db/schema.ts`
- **biome.json**: Formatter (tabs, indent 2), linter with React/Next.js rules. Ignores: `node_modules`, `.next`, `src/components/ui`, `src/components/animate-ui`

## Biome Configuration Notes

- **Formatter**: Tab indentation, 2-space indent width
- **Linter**: Recommended rules enabled for React and Next.js domains
- **Excluded from linting**: UI components and animate-ui directories (shadcn/radix UI third-party code)
- **CSS**: Tailwind directives enabled

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL`: Neon PostgreSQL connection string
- Clerk authentication keys (from Clerk dashboard)

## Common Development Workflows

### Adding a Database Schema

1. Define tables in `src/db/schema.ts` using Drizzle ORM
2. Run `bun db:generate` to create migrations
3. Run `bun db:migrate` to apply migrations

### Creating Server Actions

Place new server actions in `src/actions/` directory. They should:
- Include `"use server"` at the top
- Be async functions
- Follow the naming convention (e.g., `getTestItems.ts`)

### Adding Translations

Add translation keys to `src/messages/en.json`, then use the `useTranslations()` hook (aliased as `const t`) in components to access them.

### Component Development

Components should follow this pattern:
```tsx
import React from "react";

interface Props {
  // Props definition
}

export const MyComponent: React.FC<Props> = ({ prop1 }) => {
  const t = useTranslations();

  return (
    // JSX
  );
};
```
