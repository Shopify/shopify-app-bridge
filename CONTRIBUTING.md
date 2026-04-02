# Contributing to Shopify App Bridge

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Changesets and Versioning](#changesets-and-versioning)
- [Releasing](#releasing)
- [Package-Specific Guides](#package-specific-guides)

## Getting Started

```bash
# Clone the repo
git clone git@github.com:Shopify/shopify-app-bridge.git
cd shopify-app-bridge

# Install dependencies (requires pnpm ≥ 10)
pnpm install

# Build all packages
pnpm build
```

The required Node.js version is specified in `.nvmrc`.

## Development Workflow

1. **Create a branch** off `main` for your changes.
2. **Make your changes** in the relevant package(s).
3. **Run checks locally** before pushing:
   ```bash
   pnpm format:check  # Prettier formatting
   pnpm build          # Build all packages
   pnpm lint           # Lint all packages
   pnpm type-check     # TypeScript type checking
   pnpm test           # Run tests
   ```
4. **Add a changeset** describing your changes (see below).
5. **Open a pull request** against `main`. CI will run all checks automatically.

## Changesets and Versioning

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Every PR that changes package behavior should include a changeset.

### Adding a changeset

```bash
pnpm changeset
```

This will prompt you to:

1. Select which package(s) are affected.
2. Choose a semver bump type (`patch`, `minor`, or `major`).
3. Write a summary of the change (this becomes the changelog entry).

A markdown file will be created in `.changeset/`. Commit it with your PR.

### Skipping the changelog check

If your PR doesn't need a changeset (e.g. docs-only, CI config), add the **🤖Skip Changelog** label to the PR to bypass the changelog CI check.

## Releasing

Releases are fully automated via the [Release workflow](.github/workflows/release.yml).

### How it works

1. When PRs with changesets are merged to `main`, the Release workflow runs.
2. The [changesets/action](https://github.com/changesets/action) collects all pending changesets and opens a **"Version Packages"** PR that:
   - Bumps package versions in `package.json` files.
   - Updates `CHANGELOG.md` files with the changeset summaries.
   - Removes the consumed `.changeset/*.md` files.
3. **When you merge the "Version Packages" PR**, the Release workflow runs again and this time publishes the updated packages to npm.

### Summary

```
Feature PR (with changeset) ──merge──▶ main
                                         │
                              Release workflow runs
                                         │
                              "Version Packages" PR opened
                                         │
                                   ──merge──▶ main
                                                │
                                     Release workflow runs
                                                │
                                        Published to npm 🚀
```

> **Important:** Do _not_ manually bump versions or edit changelogs. Let Changesets handle it.

## Package-Specific Guides

Some packages have their own `CONTRIBUTING.md` with additional details:

- [`packages/app-bridge-types/CONTRIBUTING.md`](packages/app-bridge-types/CONTRIBUTING.md) — `@shopify/app-bridge-types`
