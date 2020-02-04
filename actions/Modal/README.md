# Modal

Modals are overlays that prevent merchants from interacting with the rest of the application until a specific action is taken.
They can be disruptive because they require merchants to take an action before they can continue interacting with the rest of Shopify.
It should be used thoughtfully and sparingly.
The `Modal` action set allows you to open two types of modal: message and iframe.

## Setup

Create an app and import the `Modal` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Modal} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
});
```

## Create a message modal

```js
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
};

const myModal = Modal.create(app, modalOptions);
```

## Create an iframe modal

To display content through an iframe inside a modal, supply a `path` or `url` in the options during initialization.
The modal becomes an iframe modal if either of these options is supplied, even when the `message` option is present.

If both `path` and `url` is provided, `url` takes precedence.

Note that iframe modals can only display content from your app’s domain.

### iframe modal with an absolute url

```js
const modalOptions = {
  title: 'My Modal',
  url: 'http://example.com',
};

const myModal = Modal.create(app, modalOptions);
```

### iframe modal with a relative path

The iframe URL will be set to a path that's relative to your app root:

```js
const modalOptions = {
  title: 'My Modal',
  path: '/setting',
};

const myModal = Modal.create(app, modalOptions);
```

## Create a modal with footer buttons

You can attach buttons to the modal footer. To learn more about buttons, see [Button](../Button).

```js
const okButton = Button.create(app, {label: 'Ok'});
const cancelButton = Button.create(app, {label: 'Cancel'});
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  footer: {
    buttons: {
      primary: okButton,
      secondary: [cancelButton],
    },
  },
};

const myModal = Modal.create(app, modalOptions);
```

## Subscribe to actions

You can subscribe to modal actions by calling `subscribe`. This returns a method that you can call to unsubscribe from the action:

```js
const modalOptions = {
  title: 'My Modal',
  url: 'http://example.com',
};

const myModal = Modal.create(app, modalOptions);

const openUnsubscribe = myModal.subscribe(Modal.Action.OPEN, () => {
  // Do something with the open event
});

const closeUnsubscribe = myModal.subscribe(Modal.Action.CLOSE, () => {
  // Do something with the close event
});

// Unsubscribe to actions
openUnsubscribe();
closeUnsubscribe();
```

## Unsubscribe

You can call `unsubscribe` to remove all subscriptions on the modal and its children (including buttons):

```js
const okButton = Button.create(app, {label: 'Ok'});
okButton.subscribe(Button.Action.CLICK, () => {
  // Do something with the click action
});
const cancelButton = Button.create(app, {label: 'Cancel'});
cancelButton.subscribe(Button.Action.CLICK, () => {
  // Do something with the click action
});
const modalOptions = {
  title: 'My Modal',
  url: 'http://example.com',
  footer: {
    buttons: {
      primary: okButton,
      secondary: [cancelButton],
    },
  },
};

const myModal = Modal.create(app, modalOptions);

myModal.subscribe(Modal.Action.OPEN, () => {
  // Do something with the open event
});

myModal.subscribe(Modal.Action.CLOSE, () => {
  // Do something with the close event
});

// Unsubscribe from modal open and close actions
// Unsubscribe from okButton and cancelButton click actions
myModal.unsubscribe();
```

## Unsubscribe from modal actions only

You can call `unsubscribe` with `false` to remove only modal subscriptions while leaving child subscriptions intact. For example, you might want to unsubscribe from the modal but keep button listeners so that the buttons can be reused in a different modal.

```js
const okButton = Button.create(app, {label: 'Ok'});
okButton.subscribe(Button.Action.CLICK, () => {
  // Do something with the click action
});
const cancelButton = Button.create(app, {label: 'Cancel'});
cancelButton.subscribe(Button.Action.CLICK, () => {
  // Do something with the click action
});

const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  footer: {
    buttons: {
      primary: okButton,
      secondary: [cancelButton],
    },
  },
};

const myModal = Modal.create(app, modalOptions);

// Unsubscribe only from modal open and close actions
myModal.unsubscribe(false);

// The buttons above can be reused in a new modal
// Their subscriptions will be left intact

const newModalOptions = {
  title: 'Confirm',
  message: 'Are you sure?',
  footer: {
    buttons: {
      primary: okButton,
      secondary: [cancelButton],
    },
  },
};

const confirmModal = Modal.create(app, newModalOptions);
```

## Dispatch actions

```js
const modalOptions = {
  title: 'My Modal',
  url: 'http://example.com',
};

const myModal = Modal.create(app, modalOptions);

myModal.dispatch(Modal.Action.OPEN);

// Close modal
myModal.dispatch(Modal.Action.CLOSE);
```

## Update options

You can call the `set` method with partial modal options to update the options of an existing modal. This automatically triggers the `update` action on the modal and merges the given options with the existing options.

```js
const modalOptions = {
  title: 'My Modal',
  url: 'http://example.com',
};

const myModal = Modal.create(app, modalOptions);

myModal.set({title: 'My new title'});
```

## Update footer buttons

You can update buttons attached to a modal's footer. Any updates made to the modal's children automatically trigger an `update` action on the modal:

```js
const okButton = Button.create(app, {label: 'Ok'});
const cancelButton = Button.create(app, {label: 'Cancel'});
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  footer: {
    buttons: {
      primary: okButton,
      secondary: [cancelButton],
    },
  },
};

const myModal = Modal.create(app, modalOptions);
myModal.dispatch(Modal.Action.OPEN);

okButton.set({label: 'Good to go!'});
```

## Set modal size

By default, modals have a fixed size of `Small`. You can customize the size of a modal by passing in a different `Modal.Size` value:

```js
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  size: Modal.Size.Large,
};

const myModal = Modal.create(app, modalOptions);
myModal.dispatch(Modal.Action.OPEN);
```

There are 3 values for `Modal.Size`: `Small`, `Medium` and `Large`.

> Note
> The full screen modal size has been deprecated in version 1.6.5. If you open a modal with the size set to `Full` it will display in the default size of `Medium`

> Note
> The `Auto` modal size has been deprecated in version 1.12.x and moved into a separate utility. If you open a modal with the size set to `Auto` it will default to size `Medium`.

## Set modal size automatically

The `setupModalAutoSizing` utility allows your iframe modal to update its height to fit the page content.

In your main app, open an iframe modal:
```js
import createApp from '@shopify/app-bridge';
import {Modal} from '@shopify/app-bridge/actions';
import {setupModalAutoSizing} from '@shopify/app-bridge-utils';

const app = createApp({
  apiKey: '12345',
});

const modalOptions = {
  title: 'My Modal',
  path: '/modal',
};

const myModal = Modal.create(app, modalOptions);
myModal.dispatch(Modal.Action.OPEN);
```

Inside the modal page, import the `setupModalAutoSizing` utility to enable auto sizing:

```js
import createApp from '@shopify/app-bridge';
import {setupModalAutoSizing} from '@shopify/app-bridge-utils';
const app = createApp({
  apiKey: '12345',
});
setupModalAutoSizing(app);
```

Avoid setting `height`, `margin` or `padding` styles on the `<body>` element of your modal page, as these will interfere with automatic modal sizing. As a workaround, set these styles on a wrapper element instead. Note that Shopify Polaris applies `height: 100%` to the `<body>` element by default.

> Note
> The automatic modal sizing utility works with all size options.
