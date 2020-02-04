# Toast

The `Toast` action set displays a non-disruptive message that appears at the bottom of the interface to provide quick, at-a-glance feedback on the outcome of an action.

Use `Toast` to convey general confirmation or actions that aren’t critical. For example, you might show a toast message to inform the merchant that their recent action was successful.

## Setup

Create an app and import the `Toast` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Toast} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

## Create a toast notice

Generate a toast notice:

```js
const toastOptions = {
  message: 'Product saved',
  duration: 5000,
};
const toastNotice = Toast.create(app, toastOptions);
```

## Create a toast error message

Generate an error toast notice:

```js
const toastOptions = {
  message: 'Error saving',
  duration: 5000,
  isError: true,
};
const toastError = Toast.create(app, toastOptions);
```

## Subscribe to actions

You can subscribe to toast actions by calling `subscribe`. This returns a method that you can call to unsubscribe from the action:

```js
const toastNotice = Toast.create(app, {message: 'Product saved'});
const showUnsubscribe = toastNotice.subscribe(Toast.Action.SHOW, data => {
  // Do something with the show action
});

const clearUnsubscribe = toastNotice.subscribe(Toast.Action.CLEAR, data => {
  // Do something with the clear action
});

// Unsubscribe
showUnsubscribe();
clearUnsubscribe();
```

## Unsubscribe

You call `unsubscribe` to remove all current subscriptions on the toast message:

```js
const toastNotice = Toast.create(app, {message: 'Product saved'});
toastNotice.subscribe(Toast.Action.SHOW, data => {
  // Do something with the show action
});
toastNotice.subscribe(Toast.Action.CLEAR, data => {
  // Do something with the clear action
});

// Unsubscribe
toastNotice.unsubscribe();
```

## Dispatch show action

```js
const toastNotice = Toast.create(app, {message: 'Product saved'});
toastNotice.dispatch(Toast.Action.SHOW);
```

## Dispatch clear action

```js
const toastNotice = Toast.create(app, {message: 'Product saved'});
toastNotice.dispatch(Toast.Action.CLEAR);
```
