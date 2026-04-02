# `@shopify/app-bridge-types`

**[Join our team and work on libraries like this one.](https://www.shopify.ca/careers)**

[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE.md)

This is a companion library with TypeScript types for [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge).

## Installation

You can install Shopify App Bridge Types by using [NPM](https://npmjs.com):

```sh
npm install --save-dev @shopify/app-bridge-types
```

## Development

### How Types are Generated

The types in this package are downloaded from the Shopify CDN during the build step:

1. The App Bridge team publishes the type definitions to `https://cdn.shopify.com/shopifycloud/app-bridge.d.ts`
2. During build, `scripts/build.mjs` fetches the `.d.ts` file from the CDN and writes it to `dist/index.d.ts`
3. The downloaded types are then published to npm

### Releasing a New Version

To release a new version of the types package:

1. Ensure the updated types have been published to the CDN
2. Run `pnpm changeset` from the root of the repository
3. Select `@shopify/app-bridge-types` to bump its version
4. Commit your changes
5. CI will automatically handle building and publishing the updated package
