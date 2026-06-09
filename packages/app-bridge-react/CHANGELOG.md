# Changelog

## 4.2.11

### Patch Changes

- Updated dependencies [e088d1c]
  - @shopify/app-bridge-types@0.7.1

## 4.2.10

### Patch Changes

- Updated dependencies [`9f8ecdb615732364fbdb1c010f385e58b4b5525d`]:
  - @shopify/app-bridge-types@0.7.0

## 4.2.9

### Patch Changes

- Updated dependencies [`e6a8c26486ab44faa524d8041bbdcb3bbb6b1515`]:
  - @shopify/app-bridge-types@0.6.0

## 4.2.8

### Patch Changes

- #882 `c69c5196a0442c5e656b691ef00166dec4145b72` Thanks [@Fionoble](https://github.com/Fionoble)! - Force patch

## 4.2.7

### Patch Changes

- Updated dependencies [`196fc00a83f058c00a07ff0393cf7c82fd0e8537`]:
  - @shopify/app-bridge-types@0.5.3

## 4.2.6

### Patch Changes

- Updated dependencies [`e41a88088b48ed9fa5f83a286a07d423b21d59f7`]:
  - @shopify/app-bridge-types@0.5.2

## 4.2.5

### Patch Changes

- Updated dependencies [`dd9205fceb4f2a7e8cfe8e161dd1d80537fd2747`]:
  - @shopify/app-bridge-types@0.5.1

## 4.2.4

### Patch Changes

- Updated dependencies [`e8e0b29249891fd59e7a709b8c6990fa5ae6908b`]:
  - @shopify/app-bridge-types@0.5.0

## 4.2.3

### Patch Changes

- Updated dependencies [`4f7742e4aacb581a380c76742689dca617c86b6d`]:
  - @shopify/app-bridge-types@0.4.0

## 4.2.2

### Patch Changes

- Updated dependencies [`ad18a376e0e7a4e3921fa8f394d424644eb1f7bc`]:
  - @shopify/app-bridge-types@0.3.0

## 4.2.1

### Patch Changes

- Updated dependencies [`6334cc4f89f8c22c871dfb122f8d5aba358b26a3`]:
  - @shopify/app-bridge-types@0.2.0

## 4.2.0

### Minor Changes

- #518 `bc1af9034c8cca66ebd7a44474aa7a11de7013e9` Thanks [@SammyJoeOsborne](https://github.com/SammyJoeOsborne)! - Adding types for reviews plugin api.

### Patch Changes

- Updated dependencies [`bc1af9034c8cca66ebd7a44474aa7a11de7013e9`]:
  - @shopify/app-bridge-types@0.1.0

## 4.1.10

### Patch Changes

- #392 `f5e596d9dba93eb0f846ef4a1cac8ab670a3efc3` Thanks [@henrytao-me](https://github.com/henrytao-me)! - Remove node version in package.json for app-bridge-react

## 4.1.9

### Patch Changes

- #383 `699da8fa064a60883caea326804b0a5b309e5c00` Thanks [@henrytao-me](https://github.com/henrytao-me)! - Fix build tools for app-bridge-react and all extensibility packages to support both ESM and CommonJS build output

## 4.1.8

### Patch Changes

- #325 `dfac2e4a775102b81488155dc4b00c8132988a22` Thanks [@elanalynn](https://github.com/elanalynn)! - Expose ResourcePicker and Toast types

- Updated dependencies [`dfac2e4a775102b81488155dc4b00c8132988a22`]:
  - @shopify/app-bridge-types@0.0.18

## 4.1.7

### Patch Changes

- Updated dependencies [`d3d0b4e41a0c2538b7c2f1f57ed22765c629241f`]:
  - @shopify/app-bridge-types@0.0.17

## 4.1.6

### Patch Changes

- Updated dependencies [`934d5c06c26f5b822a72be983c219c9f65fabcf2`]:
  - @shopify/app-bridge-types@0.0.16

## 4.1.5

### Patch Changes

- #34 `617f7c7412bed204f9a757ad11cad8635820e4dc` Thanks [@charlesdobson](https://github.com/charlesdobson)! - fix build output due to misconfigured build script

- Updated dependencies [`617f7c7412bed204f9a757ad11cad8635820e4dc`]:
  - @shopify/app-bridge-types@0.0.15

## 4.1.4

### Patch Changes

- Updated dependencies [`a79a42172c1af3412ed40213f89e694ac8ada6dd`]:
  - @shopify/app-bridge-types@0.0.14

## 4.1.3

### Patch Changes

- #76 `bb530e3` Thanks [@henrytao-me](https://github.com/henrytao-me)! - Fix leave confirmation for saveBar

## 4.1.2

### Patch Changes

- #69 `153c3dd` Thanks [@henrytao-me](https://github.com/henrytao-me)! - Bump app-brige-types

## 4.1.1

### Patch Changes

- #66 `1678fe8` Thanks [@charlesdobson](https://github.com/charlesdobson)! - expose CHANGELOG.md

## 4.1.0

### Minor Changes

- #62 `8541115` Thanks [@henrytao-me](https://github.com/henrytao-me)! - add src prop to Modal component to support iframe modals

- #64 `b1fbf2b` Thanks [@henrytao-me](https://github.com/henrytao-me)! - add SaveBar component to declaratively control the contextual save bar

## 4.0.0

See the [migration guide](https://shopify.dev/docs/api/app-bridge/migration-guide) for more details on how to migrate your app.

### Major Changes

- Added requirement to add the `app-bridge.js` script tag in your app
- Added requirement to use `react` and `react-dom` 18 or higher
- Refactored `Modal` component to accept custom DOM content instead of `src` and `message` props
- Refactored `NavigationMenu` component (renamed `NavMenu`) to accept `<a>` elements as children instead of `navigationLinks` and `matcher` props
- Refactored `TitleBar` component to accept `<a>`, `<button>`, and `<section>` elements as children instead of primaryAction, secondaryActions, actionGroups, and breadcrumbs props
- Removed `ContextualSaveBar` component in favour of it being [automatically configured through `form` elements](https://shopify.dev/docs/api/app-bridge-library/apis/contextual-save-bar)
- Removed `Loading` component in favour of the [`shopify.loading` API](https://shopify.dev/docs/api/app-bridge-library/apis/loading)
- Removed `ResourcePicker` component in favour of the [`shopify.resourcePicker` API](https://shopify.dev/docs/api/app-bridge-library/apis/resource-picker)
- Removed `Toast` component in favour of the [`shopify.toast` API](https://shopify.dev/docs/api/app-bridge-library/apis/toast)
- Refactored `useAppBridge` hook to access the `shopify` global variable instead of the `app` instance
- Removed `useAppBridgeState` hook in favour of the [`shopify.user` API](https://shopify.dev/docs/api/app-bridge-library/apis/user) and others
- Removed `useAuthenticatedFetch` hook as the `app-bridge.js` script injects automatic authorization into the global `fetch` function
- Removed `useContextualSaveBar` hook in favour of it being [automatically configured through `form` elements](https://shopify.dev/docs/api/app-bridge-library/apis/contextual-save-bar)
- Removed `useNavigate` hook in favour of the [browser Navigation API](https://shopify.dev/docs/api/app-bridge-library/apis/navigation)
- Removed `useNavigationHistory` hook in favour of the [browser History API](https://shopify.dev/docs/api/app-bridge-library/apis/navigation)
- Removed `useToast` hook in favour of the [`shopify.toast` API](https://shopify.dev/docs/api/app-bridge-library/apis/toast)
