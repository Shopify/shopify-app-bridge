import type {LegacyRef, ReactNode} from 'react';
import type {UITitleBarAttributes} from '@shopify/app-bridge-types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-title-bar': UITitleBarAttributes & {
        ref?: LegacyRef<UITitleBarElement | null>;
      };
    }
  }
}

export interface TitleBarProps extends Omit<UITitleBarAttributes, 'children'> {
  children?: ReactNode;
}

/**
 * This component is a wrapper around the App Bridge `ui-title-bar` element.
 * It is used to to populate the app title bar with button actions or the
 * modal header and footer when used within the Modal component.
 *
 * @see {@link https://shopify.dev/docs/api/app-bridge-library/react-components/titlebar}
 */
export const TitleBar =
  'ui-title-bar' as unknown as React.ComponentType<TitleBarProps>;
