# Loading

The loading action set is used to indicate to merchants that a page is loading or an upload is processing.

## Setup

Create an app and import the `Loading` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Loading} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});

const loading = Loading.create(app);
```

## Start loading

Call the `START` loading action when loading new pages or completing asynchronous requests that might be more than a few seconds:

```js
loading.dispatch(Loading.Action.START);
```

## Stop loading

After the loading action is complete, you can dispatch the `STOP` loading action:

```js
loading.dispatch(Loading.Action.STOP);
```

## Subscribe to actions

You can subscribe to actions that are dispatched through the loading action set:

```js
loading.subscribe(Loading.Action.START, () => {
  // Do something when loading starts
});

loading.subscribe(Loading.Action.STOP, () => {
  // Do something when loading stops
});
```

## Subscribe to all actions

You can subscribe to all loading actions, regardless of which action sets trigger the actions:

```js
app.subscribe(Loading.Action.START, () => {
  // Do something when loading starts
});

app.subscribe(Loading.Action.STOP, () => {
  // Do something when loading stops
});
```
