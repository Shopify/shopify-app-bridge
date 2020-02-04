# History

The `History` action set allows you to use the JavaScript History API to modify the top-level browser URL.

## Setup

Create an app and import the `History` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {History} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});

const history = History.create(app);
```

## Push a new history entry containing the relative app path

The path is relative to the app origin and must be prefixed with a slash. Adding a history entry does not redirect the app:

```js
// Pushes {appOrigin}/settings to the history
history.dispatch(History.Action.PUSH, '/settings');
```

## Replace the current history entry with the relative app path

The path is relative to the app origin and must be prefixed with a slash. Replacing the history entry does not redirect the app:

```js
// Replaces the current history url with {appOrigin}/settings
history.dispatch(History.Action.REPLACE, '/settings');
```

## Subscribe to actions

You can subscribe to actions dispatched through the specific history action set:

```js
history.subscribe(History.Action.REPLACE, (payload: History.Payload) => {
  // Do something with the history replace action
  console.log(`Updated the history entry to path: ${payload.path}`);
});

history.subscribe(History.Action.PUSH, (payload: History.Payload) => {
  // Do something with the history push action
  console.log(`Added a history entry with the path: ${payload.path}`);
});
```

## Subscribe to all history actions

You can subscribe to all history actions, regardless of which action sets trigger the actions:

```js
app.subscribe(History.Action.REPLACE, (payload: History.Payload) => {
  // Do something with the history replace action
  console.log(`Updated the history entry to path: ${payload.path}`);
});

app.subscribe(History.Action.PUSH, (payload: History.Payload) => {
  // Do something with the history push action
  console.log(`Added a history entry with the path: ${payload.path}`);
});
```
