# Changelog

## 0.7.1

### Patch Changes

- e088d1c: Automated update of CDN types (+1662 -62 lines)

  See the [App Bridge changelog](https://shopify.dev/changelog?filter=api&api_type=app-bridge) for details.

## 0.7.0

### Minor Changes

- #943 `9f8ecdb615732364fbdb1c010f385e58b4b5525d` Thanks [@bashu-shopify](https://github.com/bashu-shopify)! - Add theme app extension types to the App Bridge extensions API

  This adds support for theme app extensions (blocks and embeds) in the `shopify.app.extensions()` API response. New types include:
  - `ExtensionType`: `'ui_extension' | 'theme_app_extension'`
  - `ActivationStatus`: `'active' | 'available' | 'unavailable'`
  - `ThemeExtensionActivation`: Represents a theme app block or embed
  - `ThemeAppBlockActivation`: Represents where a block is placed in a theme
  - `ThemeAppBlockTarget` and `ThemeAppEmbedTarget`: Target location types

  The `ExtensionInfo` interface is now a generic that provides typed activations based on the extension type.

## 0.6.0

### Minor Changes

- #932 `e6a8c26486ab44faa524d8041bbdcb3bbb6b1515` Thanks [@bashu-shopify](https://github.com/bashu-shopify)! - Add theme app extension types to the App Bridge extensions API

  This adds support for theme app extensions (blocks and embeds) in the `shopify.app.extensions()` API response. New types include:
  - `ExtensionType`: `'ui_extension' | 'theme_app_extension'`
  - `ActivationStatus`: `'active' | 'available' | 'unavailable'`
  - `ThemeExtensionActivation`: Represents a theme app block or embed
  - `ThemeAppBlockActivation`: Represents where a block is placed in a theme
  - `ThemeAppBlockTarget` and `ThemeAppEmbedTarget`: Target location types

  The `ExtensionInfo` interface is now a generic that provides typed activations based on the extension type.

## 0.5.3

### Patch Changes

- #817 `196fc00a83f058c00a07ff0393cf7c82fd0e8537` Thanks [@olavoasantos](https://github.com/olavoasantos)! - Fix WebVitals onReport payload type

## 0.5.2

### Patch Changes

- #810 `e41a88088b48ed9fa5f83a286a07d423b21d59f7` Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add `@standard-schema/spec` as a dependency

## 0.5.1

### Patch Changes

- #796 `dd9205fceb4f2a7e8cfe8e161dd1d80537fd2747` Thanks [@andrewiggins](https://github.com/andrewiggins)! - Improve `resourcePicker()` to infer it's return type based on the given options

## 0.5.0

### Minor Changes

- #781 `e8e0b29249891fd59e7a709b8c6990fa5ae6908b` Thanks [@charlesdobson](https://github.com/charlesdobson)! - add types for intents.invoke API

## 0.4.0

### Minor Changes

- #760 `4f7742e4aacb581a380c76742689dca617c86b6d` Thanks [@Fionoble](https://github.com/Fionoble)! - Add new s-app-\* types

## 0.3.0

### Minor Changes

- #669 `ad18a376e0e7a4e3921fa8f394d424644eb1f7bc` Thanks [@SammyJoeOsborne](https://github.com/SammyJoeOsborne)! - Updating ReviewRequestDeclinedResponse type with new codes: already-open, open-in-progress, and cancelled

## 0.2.0

### Minor Changes

- #623 `6334cc4f89f8c22c871dfb122f8d5aba358b26a3` Thanks [@SammyJoeOsborne](https://github.com/SammyJoeOsborne)! - Updating ReviewRequestDeclinedResponse type with new recently-installed code

## 0.1.0

### Minor Changes

- #518 `bc1af9034c8cca66ebd7a44474aa7a11de7013e9` Thanks [@SammyJoeOsborne](https://github.com/SammyJoeOsborne)! - Adding types for reviews plugin api.

## 0.0.18

### Patch Changes

- #325 `dfac2e4a775102b81488155dc4b00c8132988a22` Thanks [@elanalynn](https://github.com/elanalynn)! - Expose ResourcePicker and Toast types

## 0.0.17

### Patch Changes

- #298 `d3d0b4e41a0c2538b7c2f1f57ed22765c629241f` Thanks [@MitchLillie](https://github.com/MitchLillie)! - Remove abn as a app-bridge-types dev dependency

## 0.0.16

### Patch Changes

- #195 `934d5c06c26f5b822a72be983c219c9f65fabcf2` Thanks [@charlesdobson](https://github.com/charlesdobson)! - sync picker types with host and add types to package

## 0.0.15

### Patch Changes

- #34 `617f7c7412bed204f9a757ad11cad8635820e4dc` Thanks [@charlesdobson](https://github.com/charlesdobson)! - fix build output due to misconfigured build script

## 0.0.14

### Patch Changes

- #12 `a79a42172c1af3412ed40213f89e694ac8ada6dd` Thanks [@charlesdobson](https://github.com/charlesdobson)! - structure output in dist dir

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.13] - 2023-04-24

- Remove incorrectly added `Symbol()` declaration causing issues with import

## [0.0.3] - 2023-07-27

### Changed

- Correct `resourcePicker()` return value and TS types to return the Array of selected entities directly. For the time being, the Array has a `.selection` property for backwards compatibility with the interface we launched with. (#131)

## [0.0.2] - 2023-07-19

### Added

- ResourcePicker types (#97)
- Custom element types for ui-title-bar and ui-nav-menu (#108)
- Custom attribute types for React buttons (#108)
- shopify global types for reference outside of window (#108)

### Removed

- Unused titleBar setState type on ShopifyGlobal (#108)
