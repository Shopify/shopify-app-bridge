# Error

You can subscribe to runtime errors similar to other action types. Error actions may occur asynchronously after actions are dispatched, so it’s a good idea to subscribe to app errors. Errors will be thrown in the console if there isn't an error handler defined.

## Setup

Create an app and import the `Error` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Error} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin,
});
```

## Subscribe to all errors through the app

Call the `app.error` method to subscribe to all App Bridge errors, including those that are caused by actions. Calling `app.error` returns a method that you can call to unsubscribe from all errors:

```js
const unsubscribe = app.error(function(data){
  // type will be the error type
  // action will contain the original action including its id
  // message will contain additional hints on how to fix the error
  const {type, action, message} = data;

  // Handle errors here
  switch(type) {
     case Error.ActionType.INVALID_PAYLOAD:
     // Do something with the error
     break;
  }
 }
});

// Unsubscribe from all errors
unsubscribe();
```

## Subscribe to specific errors

You can call `app.subscribe` with a specific error type to subscribe only to that error type:

```js
const unsubscribe = app.subscribe(Error.ActionType.INVALID_ACTION, function(data) {
  // Do something with the error
});

// Unsubscribe from the error
unsubscribe();
```

## Subscribe to all errors for an action set

Call the `error` method on any action set to subscribe to all errors that are related to that action set:

```ts
import {Modal} from '@shopify/app-bridge/actions';

const modalOptions = {
  message: 'Hello World',
};
const modal = Modal.create(app, modalOptions);

const unsubscribe = modal.error((data: Error.ErrorAction) => {
  // type will be the error type
  // action will contain the original action including its id
  // message will contain additional hints on how to fix the error
  const {type, action, message} = data;
  // Handle all errors here
  switch(type) {
     case Error.ActionType.UNEXPECTED_ACTION:
     //Do something with the error
     break;
  }
 }
});

// Trigger an UNEXPECTED_ACTION error by updating a modal that is not opened
modal.set({title: 'Greeting'});

// Unsubscribe from all errors related to this flash
unsubscribe();
```

## Subscribe to a specific error for an action set

```ts
import {Modal} from '@shopify/app-bridge/actions';

const modalOptions = {
  message: 'Hello World',
};
const modal = Modal.create(app, modalOptions);

const unsubscribe = modal.subscribe(Error.ActionType.UNEXPECTED_ACTION, (data: Error.ErrorAction) => {
  // type will be the error type
  // action will contain the original action including its id
  // message will contain additional hints on how to fix the error
  const {type, action, message} = data;
  // Handle the error here
 }
});

// Trigger an UNEXPECTED_ACTION error by updating a modal that is not opened
modal.set({title: 'Greeting'});

// Unsubscribe from UNEXPECTED_ACTION errors related to this flash
unsubscribe();
```
