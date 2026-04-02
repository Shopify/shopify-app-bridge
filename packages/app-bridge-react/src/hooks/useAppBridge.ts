import type {ShopifyGlobal} from '@shopify/app-bridge-types';

/**
 * This proxy is used to throw a helpful error message when trying to access
 * the `shopify` global in a server environment.
 */
const serverProxy = new Proxy(
  {},
  {
    get(_, prop) {
      throw Error(
        `shopify.${String(
          prop,
        )} can't be used in a server environment. You likely need to move this code into an Effect.`,
      );
    },
  },
);

/**
 *
 * This hook returns the `shopify` global variable to use
 * App Bridge APIs such as `toast` and `resourcePicker`.
 *
 * @see {@link https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge}
 *
 * @example
 * ```jsx
 * import {useAppBridge} from '@shopify/app-bridge-react';
 * function GenerateBlogPostButton() {
 *   const shopify = useAppBridge();
 *
 *   function generateBlogPost() {
 *     // Handle generating
 *     shopify.toast.show('Blog post template generated');
 *   }
 *
 *   return <button onClick={generateBlogPost}>Generate Blog Post</button>;
 * }
 * ```
 *
 * @returns `shopify` variable or a Proxy that throws when incorrectly accessed when not in a browser context
 */
export function useAppBridge() {
  if (typeof window === 'undefined') {
    return serverProxy as unknown as ShopifyGlobal;
  }
  if (!window.shopify) {
    throw Error(
      'The shopify global is not defined. This likely means the App Bridge script tag was not added correctly to this page',
    );
  }
  return window.shopify;
}
