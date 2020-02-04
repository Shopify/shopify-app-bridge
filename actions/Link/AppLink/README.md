# AppLink

The `AppLink` action set creates a clickable relative link, for navigating within your app. `AppLink` also stores a label, which is displayed to the user. Similar to `Button`, `AppLink` is passed as an option to other action sets.

## Create an AppLink

Create an app and import the `AppLink` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {AppLink} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

## Create a link

Link to a local path within the app. The path must be prefixed with a slash and is treated as relative to the app origin:

```js
const settingsLink = AppLink.create(app, {
  label: 'Settings',
  destination: '/settings'
});
```

## Subscribe to Link actions

When an `AppLink` is clicked, App Bridge dispatches a `Redirect` action. You can subscribe to all redirect actions within your app, regardless of which action set triggered the action:

```js
app.subscribe(Redirect.ActionType.APP, (redirectData) => {
  // Do something with the redirect
  console.log(`Navigated to ${redirectData.path}`);
});
```

> Note: When your app has a subscription to `Redirect.ActionType.APP`, App Bridge doesn’t change the iframe URL. Instead, it passes the path to your callback function, where you can, for example, pass the path to your client-side router.