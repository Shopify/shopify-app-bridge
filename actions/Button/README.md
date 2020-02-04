# Button

The `Button` action set is used to build buttons for other action sets, like `TitleBar` and `Modal`.

## Setup

Create an app and import the `Button` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Button} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

## Create a button

Generate a primary button with the label `Save`:

```js
const myButton = Button.create(app, {label: 'Save'});
```

## Subscribe to click action

You can subscribe to button actions by calling `subscribe`. This returns a method that you can call to unsubscribe from the action:

```js
const myButton = Button.create(app, {label: 'Save'});
const clickUnsubscribe = myButton.subscribe(Button.Action.CLICK, data => {
  // Do something with the click event
});

// Unsubscribe to click actions
clickUnsubscribe();
```

## Dispatch click action

```js
const myButton = Button.create(app, {label: 'Save'});
myButton.dispatch(Button.Action.CLICK);
```

## Dispatch click action with a payload

```js
const myButton = Button.create(app, {label: 'Save'});
// Trigger the action with a payload
myButton.dispatch(Button.Action.CLICK, {message: 'Saved'});

// Subscribe to the action and read the payload
myButton.subscribe(Button.Action.CLICK, data => {
  // data = { payload: { message: 'Saved'} }
  console.log(`Received ${data.payload.message} message`);
});
```

## Attach buttons to a modal

You can attach buttons to other actions such as modals. To learn more about modals, see [Modal](../Modal).

```js
const okButton = Button.create(app, {label: 'Ok'});
const cancelButton = Button.create(app, {label: 'Cancel'});
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  footer: {primary: okButton, secondary: [cancelButton]},
};

const myModal = Modal.create(app, modalOptions);
```

## Button Style

You can change the style of the button by passing the `style` property. Buttons support a single alternate style, the `Danger` style:

```js
const myButton = Button.create(app, {label: 'Delete', style: Button.Style.Danger});
```

## Update options

You can call the `set` method with partial button options to update the options of an existing button. This automatically triggers the `update` action on the button and merges the new given options with existing options:

```js
const myButton = Button.create(app, {label: 'Save'});
myButton.set({disabled: true});
```

## Unsubscribe

You call `unsubscribe` to remove all current subscriptions on the button:

```js
const myButton = Button.create(app, {label: 'Save'});
myButton.subscribe(Button.Action.CLICK, data => {
  // Do something with the click event
});

myButton.unsubscribe();
```
