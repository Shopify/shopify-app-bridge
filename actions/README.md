# Actions

Shopify App Bridge introduces a new concept of actions. An action provides a way for applications and hosts to trigger events with a statically-typed payload. The following actions are currently supported:

- [Button](./Button)
- [ButtonGroup](./ButtonGroup)
- [Cart](./Cart)
- [ContextualSaveBar](./ContextualSaveBar)
- [Error](./Error)
- [Features](./Features)
- [Fullscreen](./Fullscreen)
- [Link](./Link/AppLink)
- [Loading](./Loading)
- [Menu - Channel](./Menu/ChannelMenu)
- [Menu - Navigation](./Menu/NavigationMenu)
- [Modal](./Modal)
- [Navigation - History](./Navigation/History)
- [Navigation - Redirect](./Navigation/Redirect)
- [Pos](./Pos)
- [ResourcePicker](./ResourcePicker)
- [Scanner](./Scanner)
- [Share](./Share)
- [TitleBar](./TitleBar)
- [Toast](./Toast)

## Simple actions

Simple actions can be dispatched by both hosts and apps. Hosts can subscribe to actions through the App Bridge middleware. Here is an example of a simple action:

### In an app

An app can dispatch actions:

```ts
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345'
});

// App dispatches a remote redirect action
app.dispatch(
  Redirect.toRemote({
    url: 'http://example.com'
  })
);
```

### In a host using a Redux store

A Redux store can dispatch and listen to actions:

```ts
import { Redirect } from '@shopify/app-bridge/actions';
import { createStore, AnyAction } from 'redux';

interface AppStore {
  title: string;
}

function app(
  state: AppStore,
  action: Redirect.RemoteAction | AnyAction
): AppStore {
  switch (action.type) {
    case Redirect.ActionType.REMOTE:
      const payload = (action as Redirect.RemoteAction).payload;
      //Set the window.location.href to the URL in the payload
      window.location.href = payload.url;

      return state;
    default:
      return state;
  }
}

const store = createStore(app);

// Dispatch the remote redirect action
store.dispatch(
  Redirect.toRemote({
    url: 'http://example.com'
  })
);
```

## Action sets

Action sets are groups of simple actions that are created and used only by apps. They are generated with a unique ID, and provide the additional capability for apps to subscribe directly to them. They can be thought of as a persisted set of actions that can be dispatched or subscribed to at any time.

The following examples show the [toast](./src/actions/Toast) action set in an app and in a host using a Redux store.

### In an app

```ts
import createApp from '@shopify/app-bridge';
import { Toast } from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345'
});

const toastOptions = {
  message: 'Product saved',
  duration: 5000
};

const toastNotice = Toast.create(app, toastOptions);
toastNotice.subscribe(Toast.Action.SHOW, data => {
  // Do something with the show action
});

toastNotice.subscribe(Toast.Action.CLEAR, data => {
  // Do something with the clear action
});

// Dispatch the show toast action, using the toastOptions above
toastNotice.dispatch(Toast.Action.SHOW);
```

### In a host using a Redux store

Hosts can dispatch actions that are tied to a specific instance by including the unique ID:

```ts
import {Toast} from '@shopify/app-bridge/actions';
import { createStore, AnyAction } from 'redux'

interface ToastMessage {
  id: string;
  content: string;
}
interface AppStore {
  toastMessage?: ToastMessage;
}

function app(state: AppStore, action: Redirect.RemoteAction | AnyAction,
): AppStore {
  switch (action.type) {
    case Toast.ActionType.SHOW: {
      const payload = (action as Toast.ToastAction).payload;
      const {id, content} = payload;
      // Save the unique id of the Toast
      return {
        toastMessage: {
          id,
          content,
        }
        ...state,
      };
    }
    default:
      return state;
  }
}

const store = createStore(app);

// Get the current toast message in the store
const {toastMessage} = store.getState();
// Dispatching a clear action on a specific instance of the toast action
store.dispatch(
  Toast.clear({
    id: toastMessage.id,
  })
);
```
