# TitleBar

The `TitleBar` action set allows you to populate a standardized title bar with button actions and navigation breadcrumbs.

## Setup

Create an app and import the `TitleBar` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

> Note
> In the following example, you need to store `shopOrigin` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](/api/embedded-apps/shop-origin).

```js
import createApp from '@shopify/app-bridge';
import {TitleBar} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin,
});
```

## Create a title bar

Create a title bar with the title set to `My page title`:

```js
const titleBarOptions = {
  title: 'My page title',
};

const myTitleBar = TitleBar.create(app, titleBarOptions);
```

## Create a title bar with a primary button

You can set the title bar's primary button to a button. To learn more about buttons, see [Button](../Button).

```js
const saveButton = Button.create(app, {label: 'Save'});
const titleBarOptions = {
  title: 'My page title',
  buttons: {
    primary: saveButton,
  },
};

const myTitleBar = TitleBar.create(app, titleBarOptions);
```

## Create a title bar with secondary buttons

You can set the title bar's secondary buttons to one or more buttons. The following example creates a secondary action with the label **Settings**, which triggers a redirect to a settings page local to the app.

To learn more, see [Button](../Button) and [Redirect](../Redirect).

```js
import {TitleBar, Button, Redirect} from '@shopify/app-bridge/actions';
const settingsButton = Button.create(app, {label: 'Settings'});
const redirect = Redirect.create(app);
settingsButton.subscribe('click', () => {
  redirect.dispatch({
    type: Redirect.Action.APP,
    payload: {path: '/settings'},
  });
});
const titleBarOptions = {
  title: 'My new title',
  buttons: {
    secondary: [settingsButton],
  },
};
const myTitleBar = TitleBar.create(app, titleBarOptions);
```

## Create a title bar with grouped secondary buttons

You can set the title bar's secondary buttons to one or more button groups. The following example creates a grouped secondary action with the label **More actions**, which contains two child buttons.

To learn more, see [ButtonGroup](../ButtonGroup) and [Button](../Button).

```js
import {TitleBar, Button, ButtonGroup} from '@shopify/app-bridge/actions';

const button1 = Button.create(app, {label: 'Show toast message'});
const button2 = Button.create(app, {label: 'Open modal'});

const moreActions = ButtonGroup.create(app, {
  label: 'More actions',
  buttons: [button1, button2],
});

const titleBarOptions = {
  title: 'My new title',
  buttons: {
    secondary: [moreActions],
  },
};
const myTitleBar = TitleBar.create(app, titleBarOptions);
```

## Update title bar options

You can call the `set` method with partial title bar options to update the options of an existing title bar. This automatically triggers the `update` action on the title bar and merges the given options with the existing options:

```js
const titleBarOptions = {
  title: 'My page title',
};

const myTitleBar = TitleBar.create(app, titleBarOptions);
// Update the title

myTitleBar.set({
  title: 'My new title',
});
```

> Note
> If your app contains a contextual save bar, you will not be able to make any updates to the title bar while a contextual save bar is being shown. In addition, all title bar buttons will be disabled automatically while the contextual save bar is displayed. The disabled state of the title bar buttons are reset to their previous states when the contextual save bar is hidden. To learn more about the contextual save bar, see [Contextual Save Bar action](../ContextualSaveBar).

## Update title bar primary/secondary buttons

You can update buttons attached to a title bar. Any updates made to the title bar's children automatically trigger an `update` action on the title bar:

```js
import {TitleBar, Button, ButtonGroup} from '@shopify/app-bridge/actions';

const button1 = Button.create(app, {label: 'Show toast message'});
const button2 = Button.create(app, {label: 'Open modal'});

const moreActions = ButtonGroup.create(app, {
  label: 'More actions',
  buttons: [button1, button2],
});

const titleBarOptions = {
  title: 'My new title',
  buttons: {
    secondary: [moreActions],
  },
};

const myTitleBar = TitleBar.create(app, titleBarOptions);
// Update more button's label - changes automatically get propagated to the parent title bar
moreActions.set({
  label: 'Additional options',
});
```

> Note
> If your app contains a contextual save bar, you will not be able to make any updates to the title bar buttons while a contextual save bar is being shown. In addition, all title bar buttons will be disabled automatically while the contextual save bar is displayed. The disabled state of the title bar buttons are reset to their previous states when the contextual save bar is hidden. To learn more about the contextual save bar, see [Contextual Save Bar action](../ContextualSaveBar).

## Create a title bar with breadcrumbs

You can enable breadcrumbs in the title bar by setting a button as the breadcrumb option. You can disable it by setting the option to `undefined`. **Note:** Breadcrumbs aren't shown without a title. The following example creates a breadcrumb with the label 'My Breadcrumb', which links to '/breadcrumb-link'.

To learn more, see [Button](../Button) and [Redirect](../Redirect).

```js
import {TitleBar, Button, Redirect} from '@shopify/app-bridge/actions';

const breadcrumb = Button.create(app, {label: 'My Breadcrumb'});

breadcrumb.subscribe(Button.Action.CLICK, () => {
  app.dispatch(Redirect.toApp({path: '/breadcrumb-link'}));
});

const titleBarOptions = {
  title: 'My new title',
  breadcrumbs: breadcrumb,
};

const myTitleBar = TitleBar.create(app, titleBarOptions);
```

## Subscribe to title bar updates

You can subscribe to the title bar update action by calling `subscribe`. This returns a method that you can call to unsubscribe from the action:

```js
// Using the same title bar as above
const updateUnsubscribe = myTitleBar.subscribe(ButtonGroup.Action.UPDATE, data => {
  // Do something when the button group is updated
  // The data is in the following shape: {id: string, label: string, buttons: [{id: string, label: string, disabled: boolean} ...]}
});

// Unsubscribe
updateUnsubscribe();
```

## Unsubscribe

You call `unsubscribe` to remove all subscriptions on the titlebar and its children:

```js
const settingsButton = Button.create(app, {label: 'Settings'});
settingsButton.subscribe('click', () => {
  redirect.dispatch({
    type: Redirect.Action.APP,
    payload: {path: '/settings'},
  });
});
const titleBarOptions = {
  title: 'My new title',
  buttons: {
    secondary: [settingsButton],
  },
};
const myTitleBar = TitleBar.create(app, titleBarOptions);

myTitleBar.subscribe(TitleBar.Action.UPDATE, data => {
  // Do something with the udpate action
});

// Unsubscribe from the button group update action
// Unsubscribe from settingsButton click action
myTitleBar.unsubscribe();
```

## Unsubscribe from titlebar actions only

You call `unsubscribe` with `false` to remove only titlebar subscriptions while leaving child subscriptions intact. For example, you might want to unsubscribe from the title bar but keep button listeners so that the buttons can be reused in a different actions (such as a modal).

```js
const settingsButton = Button.create(app, {label: 'Settings'});
settingsButton.subscribe('click', () => {
  redirect.dispatch({
    type: Redirect.Action.APP,
    payload: {path: '/settings'},
  });
});
const titleBarOptions = {
  title: 'My new title',
  buttons: {
    secondary: [settingsButton],
  },
};
const myTitleBar = TitleBar.create(app, titleBarOptions);

myTitleBar.subscribe(TitleBar.Action.UPDATE, data => {
  // Do something with the udpate action
  // The data is in the following shape: {id: string, title: string, buttons: [{id: string, label: string, disabled: boolean} ...]}
});

// Unsubscribe from the titlebar update action
myTitleBar.unsubscribe(false);

// Reuse settingsButton in a modal
const modalOptions = {
  title: 'My Modal',
  message: 'Hello world!',
  footer: {primary: settingsButton},
};

const myModal = Modal.create(app, modalOptions);
```
