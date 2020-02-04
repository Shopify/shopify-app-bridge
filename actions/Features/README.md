# Features

The `Features` action set allows you to find out what features are available in the current app context, and to request currently unavailable features.

## Setup

Create an app and import the `Features` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

> Note
> In the following example, you need to store `shopOrigin` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](/api/embedded-apps/shop-origin).

```js
import createApp from '@shopify/app-bridge';
import {Features, Group, Scanner} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin,
});
```

## Subscribe to feature availability updates

```js
app.subscribe(Features.ActionType.UPDATE, function () {
  // This callback is a reminder that a feature's availability has
  // changed.
  // Call `app.featuresAvailable()` to get all available features
});
```

## App.featuresAvailable()

Calling `app.featuresAvailable()` returns a promise that evaluates to the entire set of available features for the app. The feature set is represented as an object containing groups, the actions within each group, and the permissions for each action (`Dispatch` and `Subscribe`).

If `Dispatch` is equal to `true`, then you will be able to send that type of action within your app. Likewise if `Subscribe` is equal to `true`, then you will be able to subscribe to dispatches of that type of action.

If a group is not present in the state then it can be assumed that all actions contained in that group are also not available.

```js
app.featuresAvailable().then(function (state) {
  /* All actions will be in the state object:
  {
    Cart: {...},
    Button: {...},
    Modal: {...},
    ...
    Scanner: {...},
    Share: {...}
  } */
});
```

If you want to limit your resulting state to a subset of groups, then pass in a group parameter.

```js
app.featuresAvailable(Group.Cart).then(function (state) {
  // state will contain only Cart actions
  /*
  {
    Cart: {
      FETCH: {
        Dispatch: false,
        Subscribe: false
      },
      REMOVE_LINE_ITEM_PROPERTIES: {
        Dispatch: false,
        Subscribe: false
      }
      ...
    }
  } */
});
```

Multiple group filters are also supported by using `...rest` parameters.

```js
app.featuresAvailable(Group.Cart, Group.Button, Group.Modal).then(function (state) {
  // state will contain only Cart, Button, and Modal actions
  /*
  {
    Cart: {...},
    Button: {...},
    Modal: {...}
  } */
});
```
## Features Update action

<table>
  <tr>
    <th>Group</th><td>Features</td>
  </tr>
  <tr>
    <th>Action</th><td>UPDATE</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::FEATURES::UPDATE</td>
  </tr>
  <tr>
    <th>Description</th><td>Dispatches when a feature's available state changes.</td>
  </tr>
</table>

### Response

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Main</code></td>
      <td>Object</td>
      <td>The availability state of the features in the main context.</td>
    </tr>
    <tr>
      <td><code>Modal</code></td>
      <td>Object</td>
      <td>The availability state of the features in the modal context.</td>
    </tr>
  </tbody>
</table>

## Features Request action

<table>
  <tr>
    <th>Group</th><td>Features</td>
  </tr>
  <tr>
    <th>Action</th><td>REQUEST</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::FEATURES::REQUEST</td>
  </tr>
  <tr>
    <th>Description</th><td>Requests for a feature to be enabled. May result in an authorization dialog to appear, depending on the platform it is dispatched on.</td>
  </tr>
</table>

If an action is not available when you call `app.featuresAvailable()`, then you can use the `APP::FEATURES::REQUEST` action to request either a group of actions or a single action inside a group to be enabled. This is particularly useful when the app is running on a mobile device and requesting a hardware feature, such as the scanner, that needs authorization from the user.

The workflow for enabling a feature includes two parts: subscribing to `APP::FEATURES::REQUEST::UPDATE` and dispatching `APP::FEATURES::REQUEST`. `APP::FEATURES::REQUEST` is the input and `APP::FEATURES::REQUEST::UPDATE` is the output.

Requesting Camera Scanner actions:

```js
var features = Features.create(app);
features.subscribe(Features.Action.REQUEST_UPDATE, function (payload) {
  if (payload.feature[Scanner.Action.OPEN_CAMERA]) {
    var Dispatch = payload.feature[Scanner.Action.OPEN_CAMERA].Dispatch;
    console.log("Camera Scanner has been ".concat(Dispatch ? "enabled" : "disabled"));
  }
});
features.dispatch(Features.Action.REQUEST, {
  feature: Group.Scanner,
  action: Scanner.Action.OPEN_CAMERA
});
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>feature</code></td>
      <td>String</td>
      <td>The feature group that you would like to enable.</td>
    </tr>
    <tr>
      <td><code>action</code></td>
      <td>String?</td>
      <td>An optional action within the group to enable. All actions within the group will be enabled if an action is not specified.</td>
    </tr>
  </tbody>
</table>

## Features Request Update action

<table>
  <tr>
    <th>Group</th><td>Features</td>
  </tr>
  <tr>
    <th>Action</th><td>UPDATE</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::FEATURES::UPDATE</td>
  </tr>
  <tr>
    <th>Description</th><td>Dispatches with the result of a features request action.</td>
  </tr>
</table>

### Response

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>feature</code></td>
      <td>Object</td>
      <td>The new state of the requested feature.</td>
    </tr>
  </tbody>
</table>

## Application context

Shopify App Bridge applications can be opened in different places. We refer to each of these places as a **context**. Each context makes a set of features available to the application. Different contexts can provide different feature sets.

For instance, the **Modal** context has a different set of features available than the **Main** context.

> Note: The **Main** context is the default when running an embedded app using Shopify App Bridge. The context cannot be set externally, since it's determined automatically.

To check which context an application is in, you can use `app.getState()`. [Read more about `app.getState`](/api/embedded-apps/app-bridge/debugging#state).

```js
app.getState('context').then(function (context) {
  console.log('Context is: ', context); // Context is: Main
});
```