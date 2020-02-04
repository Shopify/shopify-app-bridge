# Channel Menu

> Note: `ChannelMenu` is only available to apps which are sales channels.

If your app is a sales channel, the `ChannelMenu` action set allows you to create a navigation menu in the sidebar of Shopify Admin on desktop. On Shopify Mobile, the menu is rendered in a dropdown, like `NavigationMenu`.

`ChannelMenu` uses `AppLink` action set instances.

## Setup

Create an app and import the `ChannelMenu` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {ChannelMenu, AppLink} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

Create any number of `AppLink` instances, then pass them into `ChannelMenu`.

```js
const itemsLink = AppLink.create(app, {
  label: 'Items',
  destination: '/items',
});

const settingsLink = AppLink.create(app, {
  label: 'Settings',
  destination: '/settings'
});

const channelMenu = ChannelMenu.create(app, {
  items: [itemsLink, settingsLink],
});
```

## Set an active nav item

To set the active state for the menu, pass a link to the `active` option, either using `create` or `set`.
App Bridge does not automatically set the active state.

```js
const channelMenu = ChannelMenu.create(app, {
  items: [itemsLink, settingsLink],
  active: settingsLink,
});

// or

channelMenu.set({active: settingsLink});
```

## Reset active nav item

```js
channelMenu.set({active: undefined});
```
