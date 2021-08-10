# Migrate your app from legacy SDKs to Shopify App Bridge

Shopify has two deprecated client-side app libraries, the [Embedded App SDK (EASDK)](https://shopify.dev/apps/tools/embedded-app-sdk) and the [POS App SDK](https://shopify.dev/apps/tools/pos-app-sdk/), that serve a similar function to Shopify App Bridge.

## Using Shopify App Bridge directly

If you choose to upgrade your app using the Shopify App Bridge actions directly, then you get the following benefits:

- modern front-end development workflows, including modular JavaScript
- strict versioning using SemVer, for even more stability and predictability

In the future, most new features will be added to [Shopify App Bridge](https://shopify.dev/apps/tools/app-bridge) only, and will not be made available to the EASDK. **We recommend that you upgrade to using Shopify App Bridge if you’re building a new app or doing significant upgrades to your existing app.**

## Migrating your EASDK app

The best place to start is the [Embedded App SDK (EASDK) documentation](https://shopify.dev/apps/tools/embedded-app-sdk/methods), which has been updated with corresponding App Bridge methods. Here are a few additional things to keep in mind when migrating an existing app from EASDK to Shopify App Bridge.

### Deprecated features

#### Shopify.API.Modal.input

Input modals are not supported in Shopify App Bridge.

You can [use an iFrame modal instead](https://shopify.dev/apps/tools/app-bridge/actions/modal#create-an-iframe-modal).

#### Shopify.API.Modal.setHeight

Modal size is [set in increments in App Bridge](https://shopify.dev/apps/tools/app-bridge/actions/modal#set-modal-size), and can [automatically fit to the modal contents](https://shopify.dev/tools/app-bridge/actions/modal#set-modal-size-automatically).

#### Modal URL

Modals will not accept URLs from outside of your app’s origin.

To embed content from another domain, create an iFrame modal and embed the content there.

#### Tertiary modal buttons

Because Shopify App Bridge gives you full control over button styling, primary and secondary buttons can now cover all use cases.

#### App icon

Setting an app icon via `ShopifyApp.Bar.setIcon` or `ShopifyApp.Bar.initialize` with an `icon` param has been deprecated.

You can now set your app icon on the **App setup** page in the Partners Dashboard

#### ShopifyApp.init with debug option

Calling `init` with the `debug` option is not supported in App Bridge.

We recommend [debugging using the Redux DevTools and the development version of the library instead](https://shopify.dev/apps/tools/app-bridge/debugging).

#### Pagination

Adding pagination to the title bar using `ShopifyApp.Bar.initialize` and `ShopifyApp.Bar.setPagination` has been deprecated. We recommend implenting pagination within your app’s UI. If you’re using Polaris, you can use the pagination controls provided by the Polaris Page component.

If you prefer to keep pagination in your app’s titlebar, you can use Shopify App Bridge to add pagination buttons to the titlebar.

##### Use Shopify App Bridge to add pagination buttons to the title bar

[Learn more about the TitleBar action set](https://shopify.dev/apps/tools/app-bridge/actions/titlebar).

```js
import createApp from '@shopify/app-bridge';
import { TitleBar, Button } from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
  host: host,
});

const paginationPreviousButton = Button.create(app, { label: '←' })
paginationPreviousButton.subscribe(Button.Action.CLICK, function() {
  // pagination previous action
})

const paginationNextButton = Button.create(app, { label: '→' })
paginationNextButton.subscribe(Button.Action.CLICK, function() {
  // pagination next action
})

const titleBarOptions = {
  buttons: {
    secondary: [paginationPreviousButton, paginationNextButton],
  }
};
const myAppTitleBar = TitleBar.create(app, titleBarOptions);
```

##### Use the Polaris Page component pagination controls

[Learn more about the Polaris Page component](https://polaris.shopify.com/components/structure/page/pagination).

```jsx
import React, {useCallback} from 'react';
import {Page} from '@shopify/polaris';

function myApp() {

  const paginationPrevious = useCallback(() => {
    // pagination previous action
  }, []);

  const paginationNext = useCallback(() => {
    // pagination next action
  }, []);

  const paginationOptions = {
    hasNext: true,
    hasPrevious: true,
    onNext: paginationNext,
    onPrevious: paginationPrevious
  };

  return (
    <Page title="My App" pagination={paginationOptions}>
      App
    </Page>
  );
}
```


#### protocol URL parameter

Since all embedded apps must use HTTPS, the `protocol` parameter is no longer relevant.

### Keeping the frame URL in sync

The EASDK `initialize` function automatically updates the Shopify admin URL.

Since Shopify App Bridge is designed to accomodate a broader range of uses, it can’t make this assumption. It’s only aware of navigation using [History](https://shopify.dev/apps/tools/app-bridge/actions/navigation/history) and [Redirect](https://shopify.dev/apps/tools/app-bridge/actions/navigation/redirect) actions.

If your app uses links or server-side redirects for navigation, you can keep the URL in sync by dispatching a `History.Action.REPLACE` action wherever you called EASDK’s `initialize` method (for example, after `createApp()`).

If you are using a React single page app you can utilize Shopify App Bridge's [Route Propagator component](https://shopify.dev/apps/tools/app-bridge/react-components/route-propagator)

> Note
> In the following example, you need to read the `host` parameter passed into your app. The `host` parameter must be passed in any URL during the authentication process so that it may be retried for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](./get-and-store-the-shop-origin).

---
### Using modular JavaScript, Using ES5 and the CDN-hosted library" %}

```js
import createApp from '@shopify/app-bridge';
import { History } from '@shopify/app-bridge/actions';

function initializeApp() {
  const app = createApp({
    apiKey: 'API key from Shopify Partner Dashboard',
    host: host
  });

  const history = History.create(app);
  history.dispatch(History.Action.REPLACE, `${window.location.pathname}`);

  return app;
}
```

----

```js
var AppBridge = window['app-bridge'];
var createApp = AppBridge.default;
var actions = AppBridge.actions;
var History = actions.History;

function initializeApp() {
  var app = createApp({
    apiKey: 'API key from Shopify Partner Dashboard',
    host: host
  });

  var history = History.create(app);
  history.dispatch(History.Action.REPLACE, window.location.pathname);

  return app;
}
```
---

## Migrating your POS App SDK app

[The POS App SDK documentation](https://shopify.dev/apps/tools/pos-app-sdk) has been updated with corresponding Shopify App Bridge methods. Here are a few more things to keep in mind when migrating an existing app to Shopify App Bridge.

### Cart actions

> Note
> In the following example, you need to store `host` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the host_](./get-and-store-the-shop-origin).

All cart-related functionality is handled by the [`Cart`](https://shopify.dev/apps/tools/app-bridge/actions/cart) action set in Shopify App Bridge.
There are three steps to dispatch a cart action.

1. Create the `Cart` action group instance:

```js
import { Cart } from '@shopify/app-bridge/actions';

var app = createApp({
  apiKey: '12345',
  host
});

var cart = Cart.create(app);
```

2. Subscribe to the cart update action, which returns an unsubscribe function:

```js
var unsubscribe = cart.subscribe(Cart.Action.UPDATE, function(payload) {
  console.log(payload);
});
```

3. Dispatch the desired cart action. Depending on the action, you may need to construct the action using a method from `Cart`.

- A simple cart action, passing the action type to `dispatch`:

  ```js
  cart.dispatch(Cart.Action.FETCH);
  ```

- A more complex cart action, using an action constructor method:

  ```js
  var customerPayload = { id: 123 };
  cart.dispatch(Cart.setCustomer(customerPayload));
  ```

### Fetching user and location data

In the POS App SDK, user and location data were fetched using dedicated methods.
In Shopify App Bridge, this data is accessed using `app.getState()`.

> Note
> In the following example, you need to store `host` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the host_](./get-and-store-the-shop-origin).

```js
import createApp from '@shopify/app-bridge';

var app = createApp({
  apiKey: 'API key from Shopify Partner Dashboard',
  host: host
});

app.getState('pos').then(function(pos) {
  console.log('POS location data:', pos.location);
  console.log('POS user data:', pos.user);
});
```
