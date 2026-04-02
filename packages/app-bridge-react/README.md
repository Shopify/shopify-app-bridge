<div align="center">
<h1>App Bridge React</h1>

<p>Shopify App Bridge offers React component wrappers and hooks for App Bridge features.</p>

<br />

[**Read The Docs**](https://shopify.dev/docs/api/app-bridge-library)
<br/><br/>
**[Join our team and work on libraries like this one!](https://www.shopify.ca/careers)**

</div>

<hr />

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
![npm](https://img.shields.io/npm/v/@shopify/app-bridge-react.svg)
[![NPM Downloads](https://img.shields.io/npm/dm/@shopify/app-bridge-react)](https://npmtrends.com/@shopify/app-bridge-react)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/app-bridge-react.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/app-bridge-react.svg)

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Migration](#migration-from-previous-versions)
- [Usage](#usage)
  - [Components](#components)
  - [Hooks](#hooks)
- [Issues](#issues)
  - [🐛 Bugs](#🐛-bugs)
  - [💡 Feature Requests](#💡-feature-requests)
  - [❓ Questions](#❓-questions)
- [License](#license)

## Installation

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install --save @shopify/app-bridge-react
```

If you prefer [Yarn](https://classic.yarnpkg.com/en/), use the following command instead:

```bash
yarn add @shopify/app-bridge-react
```

If you prefer [pnpm](https://pnpm.io/), use the following command instead:

```bash
pnpm add @shopify/app-bridge-react
```

## Configuration

1. Include the `app-bridge.js` script tag in your app. Replace `%SHOPIFY_API_KEY%` with your app's [client ID](https://shopify.dev/docs/apps/auth/client-secret#retrieve-your-apps-client-credentials). This configures your app to use Shopify App Bridge.

The `app-bridge.js` script is CDN-hosted, so your app always gets the latest version of it.

```html
<head>
  <meta name="shopify-api-key" content="%SHOPIFY_API_KEY%" />
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
</head>
```

2. This library has `peerDependencies` listings for [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom). Ensure you're using version `18.0.0` or higher of both packages.

## Migration from previous versions

For information on how to migrate from Shopify App Bridge React 3.x.x, see the [migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide).

## Usage

### Components

App Bridge React provides a few component wrappers for the custom elements available in App Bridge, such as [Modal](https://shopify.dev/docs/api/app-bridge-library/react-components/modal), [NavMenu](https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu), and [TitleBar](https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar).

```jsx
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';

function SocialMediaModal() {
  const shopify = useAppBridge();

  function handlePrimaryAction() {
    // Perform actions when the primary button is clicked
    shopify.modal.show('social-media-modal');
  }

  return (
    <>
      <button onClick={() => modalRef.current?.show()}>
        Expand Your Reach
      </button>
      <Modal id="social-media-modal" variant="small">
        <p style={{padding: '1rem'}}>
          Expand your reach and attract more customers by enabling easy social
          media sharing of your products.
        </p>
        <TitleBar title="Drive traffic with social media sharing">
          <button variant="primary" onClick={handlePrimaryAction}>
            Enable Social Sharing
          </button>
        </TitleBar>
      </Modal>
    </>
  );
}
```

### Hooks

App Bridge React provides the `useAppBridge` hook to make accessing the `shopify` global variable simple and helpful when used in a server-side rendered app. This variable exposes various App Bridge functionalities, such as [displaying toast notifications](https://shopify.dev/docs/api/app-bridge-library/apis/toast) or [retrieving app configuration details](https://shopify.dev/docs/api/app-bridge-library/apis/config). See the [documentation](https://shopify.dev/docs/api/app-bridge-library#shopify-global-variable) for more information on what is available through the `shopify` variable.

```jsx
import {useAppBridge} from '@shopify/app-bridge-react';

function GenerateBlogPostButton() {
  const shopify = useAppBridge();

  function generateBlogPost() {
    // Handle generating
    shopify.toast.show('Blog post template generated');
  }

  return <button onClick={generateBlogPost}>Generate Blog Post</button>;
}
```

## Issues

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behaviour using [this template](https://github.com/Shopify/shopify-app-bridge/issues/new?assignees=&labels=bug&projects=&template=bug_report.md).

### 💡 Feature Requests

Please file an issue to suggest new features using [this template](https://github.com/Shopify/shopify-app-bridge/issues/new?assignees=&labels=feature&projects=&template=feature_request.md).

### ❓ Questions

For questions related to using the library, please visit the Shopify Partner Slack linked in the Resources page of your Shopify Partner Dashboard.

## License

[MIT](./LICENSE.md)
