# Authenticate with OAuth

To keep your embedded apps secure, you are required to lock all communications to the shop origin. The shop origin is the hostname for the current shop, which consists of the shop name followed by `myshopify.com`. The shop origin for the current session is contained in the `host` URL query parameter that’s appended to your application URL when your app is loaded inside the Shopify admin.

The `host` parameter is an encoded version of the shop origin that is required since App Bridge version 2.0.

If you are building a multi-page app, it’s a good idea to retrieve the `host` parameter and then store it for the duration of the session.

## Getting and storing the host

The process of getting and storing the host is different depending on the library that you’re using for your app.

### shopify_app gem

If you’re using the [`shopify_app`](http://shopify.github.io/shopify_app/) gem, then the `host` parameter is automatically parsed from the authentication URL and stored in the session under the `:shopify_domain` key (for example, `session[:shopify_domain]`).

### Getting and storing the host manually

If you’re unable to use any of the Shopify-provided libraries listed above, then you need to parse the `host` parameter out of the authentication URL and store it for later use.

To get the `host` parameter, parse it out of the confirmation redirect URL during the [installation confirmation step](https://shopify.dev/apps/tools/app-bridge/getting-started#authenticate-with-oauth) of the authorization process.

After you’ve got the `host` parameter, you need to store it for the duration of the user session. It’s best to use the session mechanism of your preferred framework. Otherwise, you can store the parameter in an [HTTP-only cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).

## Verification

Each embedded application URL includes an `hmac` query parameter that can be used to authenticate the request from Shopify.

To learn more about this process, see the documentation about [verifying requests from Shopify](https://shopify.dev/apps/auth/oauth#verification).
