# Contributing to `@shopify/app-bridge-types`

See the [root CONTRIBUTING.md](../../CONTRIBUTING.md) for general repo guidelines.

## Overview

This package publishes TypeScript type definitions for [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge). The types originate from the Shopify CDN and are repackaged here for npm consumers.

**Source of truth:** `https://cdn.shopify.com/shopifycloud/app-bridge.d.ts`

## How the Build Works

The build process downloads the type definitions from the CDN rather than compiling from local source:

1. `scripts/build.mjs` fetches `app-bridge.d.ts` from the CDN.
2. The fetched file is written to `dist/index.d.ts`.
3. The `cjyes` tool generates the CJS wrapper (`dist/index.js`) alongside `dist/index.mjs`.

```bash
pnpm build  # in this package directory
```

## How Types Get Updated

There are two paths for updating the types when the App Bridge team publishes changes to the CDN.

### Automated (daily)

The [Check CDN Types](.github/../../.github/workflows/check-cdn-types.yml) workflow runs daily at 10:00 UTC and can also be triggered manually:

1. `scripts/check-cdn-updates.mjs` fetches the latest CDN types and compares them against the currently published npm version.
2. If they differ, it:
   - Creates a changeset (`.changeset/automated-cdn-types-update.md`).
   - Opens (or updates) a PR on the `automated/update-app-bridge-types` branch.
   - Uploads the raw diff as a workflow artifact (`cdn-types-diff`) for inspection.
3. A maintainer reviews the PR and pushes any changes to the PR branch as needed (e.g. editing the changeset to adjust the version bump level or changelog entry).
4. Merging the PR kicks off the normal [release process](../../CONTRIBUTING.md#releasing) — Changesets will open a "Version Packages" PR, and merging that PR publishes to npm.

### Manual

If you need to release ahead of the daily check, manually trigger the **Check CDN Types** workflow from the [Actions tab](https://github.com/Shopify/shopify-app-bridge/actions/workflows/check-cdn-types.yml) using the "Run workflow" button. This runs the same process as the daily check and will open a PR if the CDN types have changed.
