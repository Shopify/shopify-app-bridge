

# Fullscreen

This action set enables the embedded app to take up the entire browser window, hiding the host's navigation components.

## Enable the feature

This feature is made available through the app beta `app_bridge_feature_fullscreen`. You must enable the beta for your app before using it:
You can do so in the services internal dashboard for your app: `https://partners.shopify.com/internal/apps/{client_id}/app_betas/edit`.

For local development, you can apply the beta through the dev console in the `Shopify/shopify` repo:

1. Enter the dev console by doing `dev c`
2. Run the following code:
```
api_client = ApiClient.where(handle: 'YOUR-APP_HANDLE').first
api_client.beta.enable 'app_bridge_feature_fullscreen'
```

## Setup

Create an app and import the `Fullscreen` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

> Note
> In the following example, you need to store `shopOrigin` during the authentication process and then retrieve it for the code to work properly. To learn more about this process, see [_Getting and storing the shop origin_](/api/embedded-apps/shop-origin).

```js
import createApp from '@shopify/app-bridge';
import {Fullscreen} from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '12345',
  shopOrigin: shopOrigin,
});
```

## Create and enter fullscreen

Create a fullscreen action set and dispatch an action to enter fullscreen mode:

```js
const fullscreen = Fullscreen.create(app);

fullscreen.dispatch(Fullscreen.Action.ENTER);
```

## Exit fullscreen

Dispatch a exit action when you want to get out of fullscreen mode.

```js
fullscreen.dispatch(Fullscreen.Action.EXIT);
```
