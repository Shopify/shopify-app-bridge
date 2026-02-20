import type {LegacyRef, ReactNode} from 'react';
import type {UINavMenuAttributes} from '@shopify/app-bridge-types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-nav-menu': UINavMenuAttributes & {
        ref?: LegacyRef<UINavMenuElement | null>;
      };
    }
  }
}

export interface NavMenuProps extends Omit<UINavMenuAttributes, 'children'> {
  children?: ReactNode;
}

/**
 * This component is a wrapper around the App Bridge `ui-nav-menu` element.
 * It is used to create a navigation menu for your app.
 *
 * @see {@link https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu}
 */
export const NavMenu =
  'ui-nav-menu' as unknown as React.ComponentType<NavMenuProps>;
