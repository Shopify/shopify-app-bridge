# Redirect

The `Redirect` action set allows you to modify the top-level browser URL.
Use the `Redirect` action set to navigate within your app, or redirect merchants elsewhere within Shopify Admin or on the web.

## Setup

Create an app and import the `Redirect` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});

const redirect = Redirect.create(app);
```

## Redirect to a relative path in the app

Redirect to a local app path. The path must be prefixed with a slash and is treated as relative to the app origin:

```js
// Go to {appOrigin}/settings
redirect.dispatch(Redirect.Action.APP, '/settings');
```

## Redirect to an absolute URL outside of the app and outside of Shopify admin.

```js
// Go to http://example.com
redirect.dispatch(Redirect.Action.REMOTE, 'http://example.com');

// Go to http://example.com with newContext
redirect.dispatch(Redirect.Action.REMOTE, {
  url: 'http://example.com',
  newContext: true,
});
```

## Redirect to a relative path in Shopify admin

Redirect to the customers section in Shopify admin. The path must be prefixed with a slash.

```js
// Go to {shopUrl}/admin/customers
redirect.dispatch(Redirect.Action.ADMIN_PATH, '/customers');

// Go to {shopUrl}/admin/customers with newContext
redirect.dispatch(Redirect.Action.ADMIN_PATH, {
  path: '/customers',
  newContext: true,
});
```

## Redirect to a named section in Shopify admin

Redirect to the **Products** section in the Shopify admin:

```js
// Go to {shopUrl}/admin/products
redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
  name: Redirect.ResourceType.Product,
});

// Go to {shopUrl}/admin/products with newContext
redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
  section: {
    name: Redirect.ResourceType.Product,
  },
  newContext: true,
});
```

## Redirect to a specific resource in Shopify admin.

Redirect to the collection with the ID `123` in the Shopify admin:

```js
// Go to {shopUrl}/admin/collections/123
redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
  name: Redirect.ResourceType.Collection,
  resource: {
    id: '123',
  },
});
```

## Redirect to create a product in Shopify admin.

Redirect to `{shopUrl}/admin/products/new` in the Shopify admin:

```js
// Go to {shopUrl}/admin/products/new
redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
  name: Redirect.ResourceType.Product,
  resource: {
    create: true,
  },
});
```

## Redirect to a product variant in Shopify admin.

Redirect to the collection with the id '123' in Shopify admin:

```js
// Go to {shopUrl}/admin/products/123/variant/456
redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
  name: Redirect.ResourceType.Product,
  resource: {
    id: '123',
    variant: {
      id: '456',
    },
  },
});
```

## Redirect to create a new product variant in Shopify admin.

Redirect to `{shopUrl}/admin/products/123/variants/new` in the Shopify admin:

```js
// Go to {shopUrl}/admin/products/123/variants/new
redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
  name: Redirect.ResourceType.Product,
  resource: {
    id: '123',
    variant: {
      create: true,
    },
  },
});
```

## Subscribe to actions

You can subscribe to actions dispatched through the redirect action set:

```js
redirect.subscribe(Redirect.Action.APP, (payload: Redirect.AppPayload) => {
  // Do something with the redirect
  console.log(`Navigated to ${payload.path}`);
});
```

## Subscribe to all redirect actions

You can subscribe to all redirect actions within your app, regardless of which action sets trigger the actions:

```js
app.subscribe(Redirect.ActionType.APP, (payload: Redirect.AppPayload) => {
  // Do something with the redirect
  console.log(`Navigated to ${payload.path}`);
});
```

## Current restrictions

**Query Params**

Currently the use of query params is not supported. All query params are removed from the path on redirect to avoid issues with the HMAC being invalid because it was generated for the initial URL without params.
