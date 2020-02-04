# Share

The Share action allows you to share content from your embedded app to any 3rd Party mobile app on a mobile device, as long as the mobile app supports the payload type (some apps only support text, and some support both url and text). The list of apps will be altered based upon what you include in the payload.

## Requirements

These actions require the following app versions:

* **Shopify iOS v8.22.0** or above
* **Shopify Android v8.25.0** or above
* **Point of Sale iOS v5.29.0** or above
* **Point of Sale Android v3.24.0** or above


## Setup

Create an app and import the `Share` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

> Note
> In the following example, you need to store `shopOrigin` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](/api/embedded-apps/shop-origin).

```js
import createApp from '@shopify/app-bridge';
import {Group, Share} from '@shopify/app-bridge/actions';

var app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin
});

var share = Share.create(app);
```

## Share Close action

<table>
  <tr>
    <th>Group</th><td>Share</td>
  </tr>
  <tr>
    <th>Action</th><td>CLOSE</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::SHARE::CLOSE</td>
  </tr>
  <tr>
    <th>Description</th><td>Dispatches after closing the Share Sheet.</td>
  </tr>
</table>

The `Share` action lets you share content from your app to any third-party app on the user's device, as long as the app supports the payload type. Some apps only support text and some support URLs and text.

## Subscribe to Share Close:

```js
scanner.subscribe(Share.Action.CLOSE, function(payload) {
  // The payload will contain `success` as its only property. This is set to `true` upon a successful share and set to `false` if the action is canceled.
});
```

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
      <td><code>success</code></td>
      <td>Boolean</td>
      <td>Whether the share was successful or canceled.</td>
    </tr>
  </tbody>
</table>

## Share Open action

<table>
  <tr>
    <th>Group</th><td>Share</td>
  </tr>
  <tr>
    <th>Action</th><td>SHOW</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::SHARE::SHOW</td>
  </tr>
  <tr>
    <th>Description</th><td>Opens a Share Sheet that allows you to share content with other apps.</td>
  </tr>
</table>

```js
share.dispatch(Share.Action.SHOW, {
    text: "Hey check this out!",
    url: "https://www.reallyawesomesite.com"
});
```

> Note: In Debug Mode, `text` and `url` are optional but at least one needs to be included in the payload. If neither are present then an `APP::ERROR::INVALID_PAYLOAD` will be thrown or sent to an Error subscriber. However, in Production Mode this will silently fail.

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
      <td><code>text</code></td>
      <td>String?</td>
      <td>The text to share.</td>
    </tr>
    <tr>
      <td><code>url</code></td>
      <td>String?</td>
      <td>The URL to share.</td>
    </tr>
  </tbody>
</table>