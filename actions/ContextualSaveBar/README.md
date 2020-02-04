# Contexual Save Bar

The contextual save bar tells merchants their options once they have made changes to a form on the page. This component is also shown while creating a new object like a product or customer. Merchants can use this component to save or discard their work.

## Setup

Create an app and import the `ContextualSaveBar` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

> Note
> In the following example, you need to store `shopOrigin` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](/en/api/embedded-apps/shop-origin).

```js
import createApp from '@shopify/app-bridge';
import {ContextualSaveBar} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin,
});
```

## Create and show

Generate a contextual save bar and make it visible:

```js
const options = {
  saveAction: {
    disabled: false,
    loading: false,
  },
  discardAction: {
    disabled: false,
    loading: false,
    discardConfirmationModal: true,
  },
};
const contextualSaveBar = ContextualSaveBar.create(app, options);

contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);
```

> Note
> Navigation actions ([Redirect](../Redirect) and [History](../History)) on Shopify Admin are also blocked while the contextual save bar is visible.
> If your app contains a title bar, you will not be able to make any updates to the title bar buttons while a contextual save bar is being shown. In addition, all title bar buttons will be disabled automatically while the contextual save bar is displayed. The disabled state of buttons inside the title bar are automatically reset to their previous states when the contextual save bar is hidden. To learn more about the title bar, see [Title Bar action](../TitleBar).

## Update options

You can modify the options at any time. If the contextual save bar is visible, the UI will be updated immediately

```js
contextualSaveBar.set({discardAction: {discardConfirmation: false}});
```

## Hide

Dispatch a hide action when you want to hide the contextual save bar.

```js
contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
```

> Note
> Navigation actions ([Redirect](../Redirect) and [History](../History)) on Shopify Admin are also blocked while the contextual save bar is visible.
> If your app contains a title bar, you will not be able to make any updates to the title bar buttons while a contextual save bar is being shown. In addition, all title bar buttons will be disabled automatically while the contextual save bar is displayed. The disabled state of buttons inside the title bar are automatically reset to their previous states when the contextual save bar is hidden. To learn more about the title bar, see [Title Bar action](../TitleBar).

### Subscribe to Discard and Save

Subscribe to the contextual save bar actions (`ContextualSaveBar.Action.DISCARD` and `ContextualSaveBar.Action.DISCARD`) by calling `subscribe`. The `subscribe` method returns a method that you can call to unsubscribe from the action.

To hide the contextual save bar, dispatch a `ContextualSaveBar.Action.HIDE` action in the subscribe callback.

> Note
> Navigation actions ([Redirect](../Redirect) and [History](../History)) on Shopify Admin are blocked while the contextual save bar is visible. To dispatch navigation actions, first dispatch `ContextualSaveBar.Action.HIDE`.

```js
const discardUnsubscribe = contextualSaveBar.subscribe(
  ContextualSaveBar.Action.DISCARD,
  function() {
    // Hide the contextual save bar
    contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
    // Do something with the discard action
  }
);

const saveUnsubscribe = contextualSaveBar.subscribe(
  ContextualSaveBar.Action.SAVE,
  function() {
    // optionally show a loading spinner while the save action is in progress
    contextualSaveBar.set({saveAction: {loading: true}});

    await doSaveAction();

    // Hide the contextual save bar
    contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
  }
);

// Unsubscribe
discardUnsubscribe();
saveUnsubscribe();
```

## Unsubscribe

You call `unsubscribe` to remove all current subscriptions on the contextual save bar:

```js
contextualSaveBar.subscribe(ContextualSaveBar.Action.DISCARD, function() {
  // Do something with the discard action
  // Hide the contextual save bar
  contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
});

contextualSaveBar.subscribe(ContextualSaveBar.Action.SAVE, function() {
  // Do something with the save action
  // Hide the contextual save bar
  contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
});

// Unsubscribe
contextualSaveBar.unsubscribe();
```
