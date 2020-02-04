# Scanner

The `Scanner` action set allows you to use the mobile device camera or NFC reader to scan barcodes or NFC tags.

## Requirements

These actions require the following app versions:

* **Shopify iOS v8.25.0** or above
* **Shopify Android v8.24.0** or above
* **Point of Sale iOS v5.32.0** or above
* **Point of Sale Android v3.25.0** or above

NFC requires **iOS 12** or above.

## Setup

Create an app and import the `Scanner` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

> Note
> In the following example, you need to store `shopOrigin` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](/api/embedded-apps/shop-origin).

```js
import createApp from '@shopify/app-bridge';
import {Group, Scanner} from '@shopify/app-bridge/actions';

var app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin,
});

var scanner = Scanner.create(app);
```

## Scanner Capture action

<table>
  <tr>
    <th>Group</th><td>Scanner</td>
  </tr>
  <tr>
    <th>Action</th><td>CAPTURE</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::SCANNER::CAPTURE</td>
  </tr>
  <tr>
    <th>Description</th><td>Dispatches when a scan is successful.</td>
  </tr>
</table>

To open a Scanner component, you must first use Feature Detection to check whether it's available. If it is, then you can open it. To learn more about Feature Detection, see [*Features*](/api/embedded-apps/app-bridge/actions/features).

```js
scanner.subscribe(Scanner.Action.CAPTURE, function(payload) {
  // The payload will contain `scanData`, a string representation of the data scanned.
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
      <td><code>scanData</code></td>
      <td>String?</td>
      <td>The resulting string from scanning either an NFC tag or a barcode.</td>
    </tr>
  </tbody>
</table>

## Request access and Open Camera action

<table>
  <tr>
    <th>Group</th><td>Scanner</td>
  </tr>
  <tr>
    <th>Action</th><td>OPEN::CAMERA</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::SCANNER::OPEN::CAMERA</td>
  </tr>
  <tr>
    <th>Description</th><td>Opens a camera component for scanning barcodes.</td>
  </tr>
</table>

```js
var features = Features.create(app);
// Subscribe to the update action (triggered when the permission dialog is interacted with)
features.subscribe(Features.Action.REQUEST_UPDATE, function (payload) {
  if (payload.feature[Scanner.Action.OPEN_CAMERA]) {
    var available = payload.feature[Scanner.Action.OPEN_CAMERA].Dispatch;
    // If the Camera Scanner actions were enabled, open a Scanner
    if (available) {
      scanner.dispatch(Scanner.Action.OPEN_CAMERA)
    }
  }
});
// Dispatch an action to request access to Scanner actions
features.dispatch(Features.Action.REQUEST, {
  feature: Group.Scanner,
  action: Scanner.Action.OPEN_CAMERA
});
```

> Note: If the Camera Scanner Open action is already available, then dispatching `Scanner.Action.OPEN_CAMERA` is the only required step to use the Camera Scanner component. The state of the actions can be determined by calling `app.featuresAvailable()`.

## Open NFC action

<table>
  <tr>
    <th>Group</th><td>Scanner</td>
  </tr>
  <tr>
    <th>Action</th><td>OPEN::NFC</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::SCANNER::OPEN::NFC</td>
  </tr>
  <tr>
    <th>Description</th><td>Opens a component for scanning NFC tags.</td>
  </tr>
</table>

```js
// Check if NFC scanning is available
app.featuresAvailable(Group.Scanner).then(function (state) {
  var available = state[Group.Scanner][Scanner.Action.OPEN_NFC].Dispatch;
    // If the NFC Scanner action is enabled, open a Scanner
    if (available) {
      scanner.dispatch(Scanner.Action.OPEN_NFC)
    }
});
```