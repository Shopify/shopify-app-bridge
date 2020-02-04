# Navigation Menu

The `NavigationMenu` action set allows you to create a navigation menu for your app.
On desktop web browsers, the navigation menu is displayed under your app’s title, at the top of the screen.
On Shopify Mobile, the navigation menu is displayed in a dropdown from the titlebar.

`NavigationMenu` uses `AppLink` action set instances.

## Setup

Create an app and import the `NavigationMenu` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {NavigationMenu, AppLink} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

Create any number of `AppLink` instances, then pass them into `NavigationMenu`.

```js
const itemsLink = AppLink.create(app, {
  label: 'Items',
  destination: '/items',
});

const settingsLink = AppLink.create(app, {
  label: 'Settings',
  destination: '/settings'
});

const navigationMenu = NavigationMenu.create(app, {
  items: [itemsLink, settingsLink],
});
```

## Set an active nav item

To set the active state for the menu, pass a link to the `active` option, either using `create` or `set`.
App Bridge does not automatically set the active state.

```js
const navigationMenu = NavigationMenu.create(app, {
  items: [itemsLink, settingsLink],
  active: settingsLink,
});

// or

navigationMenu.set({active: settingsLink});
```

## Reset active nav item

```js
navigationMenu.set({active: undefined});
```
