# Navigation

There are two action sets related to navigation in Shopify App Bridge:

* `History`
* `Redirect`

Both action sets allow you to access the top-level browser URL.

The `History` action set allows you to use the JavaScript History API to modify the top-level browser URL without navigating. Use the `History` action set to update the top-level browser URL to match your app.

The `Redirect` action set allows you to modify the top-level browser URL.
Use the `Redirect` action set to navigate within your app, or to redirect merchants elsewhere within the Shopify admin or on the web.

### Using client-side routing

By default, App Bridge applies URL changes from outside your app, such as from a navigation item being clicked, by changing the iframe URL.
If your app uses client-side routing, such as React Router, then you need to override this behaviour to avoid unnecessary full-page reloads.

To override the default behaviour, subscribe to the `Redirect.ActionType.APP` action:

```js
import {Redirect} from '@shopify/app-bridge/actions';

app.subscribe(Redirect.ActionType.APP, function(redirectData) {
  console.log(redirectData.path); // For example, '/settings'
});
```

When your app has a subscription to this action, App Bridge doesn't change the iframe URL.
Instead, it passes the path to your callback function, where you can pass the path to your client-side router.
