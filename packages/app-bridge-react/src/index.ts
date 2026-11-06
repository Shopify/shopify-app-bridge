import type {
  SAppNavAttributes,
  SAppWindowAttributes,
} from '@shopify/app-bridge-types';

// App Bridge elements without a React component. @types/react 19 ignores the
// global JSX namespace that @shopify/app-bridge-types augments. s-page is left
// to @shopify/polaris-types, which already declares it on React's JSX.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      's-app-nav': SAppNavAttributes & {
        ref?: import('react').LegacyRef<SAppNavElement | null>;
      };
      's-app-window': SAppWindowAttributes & {
        ref?: import('react').LegacyRef<SAppWindowElement | null>;
      };
    }
  }
}

export type {ModalProps} from './components/Modal';
export {Modal} from './components/Modal';

export type {NavMenuProps} from './components/NavMenu';
export {NavMenu} from './components/NavMenu';

export type {TitleBarProps} from './components/TitleBar';
export {TitleBar} from './components/TitleBar';

export type {SaveBarProps} from './components/SaveBar';
export {SaveBar} from './components/SaveBar';

export {useAppBridge} from './hooks/useAppBridge';

export type * from '@shopify/app-bridge-types';
