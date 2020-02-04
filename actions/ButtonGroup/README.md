# ButtonGroup

The `ButtonGroup` action set is used to group together `Button` action set instances.
`ButtonGroup` can be passed into your app’s `TitleBar`.

## Setup

Create an app and import the `Button` and `ButtonGroup` modules from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Button, ButtonGroup} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

## Create a button group

Generate a primary button with the label `More actions` and two buttons with the label `Settings` and `Help`:

```js
const button1 = Button.create(app, {label: 'Settings'});
const button2 = Button.create(app, {label: 'Help'});
const myGroupButton = ButtonGroup.create(app, {label: 'More actions', buttons: [button1, button2]});
```

## Subscribe to updates

You can subscribe to the button group update action by calling `subscribe`. This returns a method that you can call to unsubscribe from the action:

```js
// Using the same button group as above
const updateUnsubscribe = myGroupButton.subscribe(ButtonGroup.Action.UPDATE, data => {
  // Do something when the button group is updated
  // The data is in the following shape: {id: string, label: string, buttons: [{id: string, label: string, disabled: boolean,} ...]}
});

// Unsubscribe
updateUnsubscribe();
```

## Unsubscribe

You call `unsubscribe` to remove all subscriptions on the button group and its children:

```js
const button1 = Button.create(app, {label: 'Settings'});
const button2 = Button.create(app, {label: 'Help'});
const myGroupButton = ButtonGroup.create(app, {label: 'More actions', buttons: [button1, button2]});
// Using the same button group as above
myGroupButton.subscribe(ButtonGroup.Action.UPDATE, data => {
  // Do something when the button group is updated
  // The data is in the following format: {id: string, label: string, buttons: [{id: string, label: string, disabled: boolean} ...]}
});

button1.subscribe(Button.Action.CLICK, () => {
  //Do something with the click action
});

button2.subscribe(Button.Action.CLICK, () => {
  //Do something with the click action
});

// Unsubscribe from the button group update action
// Unsubscribe from button1 and button2 click actions
myGroupButton.unsubscribe();
```

## Unsubscribe from button group actions only

You call `unsubscribe` with `false` to remove only button group subscriptions while leaving child subscriptions intact. For example, you might want to unsubscribe from the button group but keep button listeners so that the buttons can be reused in a different actions (such as a modal).

```js
const button1 = Button.create(app, {label: 'Settings'});
const button2 = Button.create(app, {label: 'Help'});
const myGroupButton = ButtonGroup.create(app, {label: 'More actions', buttons: [button1, button2]});
// Using the same button group as above
myGroupButton.subscribe(ButtonGroup.Action.UPDATE, data => {
  // Do something when the button group is updated
  // The data is in the following format: {id: string, label: string, buttons: [{id: string, label: string, disabled: boolean} ...]}
});

button1.subscribe(Button.Action.CLICK, () => {
  //Do something with the click action
});

button2.subscribe(Button.Action.CLICK, () => {
  //Do something with the click action
});

// Unsubscribe from only the button group update action
myGroupButton.unsubscribe(false);

// Reuse button1 and button2 in a modal
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  footer: {secondary: [button1, button2]},
};

const myModal = Modal.create(app, modalOptions);
```

## Update options

You can call the `set` method with partial button group options to update the options of an existing button group. This automatically triggers the `update` action on the button group and merges the new given options with existing options.

```js
const button1 = Button.create(app, {label: 'Settings'});
const button2 = Button.create(app, {label: 'Help'});
const myGroupButton = ButtonGroup.create(app, {label: 'More actions', buttons: [button1, button2]});
myGroupButton.set({disabled: true});
```

## Update buttons

You can update buttons attached to a button group. Any updates made to the button group's children automatically trigger an `update` action on the button group.

```js
const button1 = Button.create(app, {label: 'Settings'});
const button2 = Button.create(app, {label: 'Help'});
const myGroupButton = ButtonGroup.create(app, {label: 'More actions', buttons: [button1, button2]});
button1.set({disabled: true});
```
