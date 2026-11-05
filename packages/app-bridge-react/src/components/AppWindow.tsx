import {
  useEffect,
  useState,
  forwardRef,
  type ForwardedRef,
  useCallback,
} from 'react';
import type {SAppWindowAttributes} from '@shopify/app-bridge-types';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      's-app-window': SAppWindowAttributes & {
        ref?: import('react').LegacyRef<SAppWindowElement | null>;
      };
    }
  }
}

export interface AppWindowProps extends SAppWindowAttributes {
  /**
   * Whether the app window is open or not
   *
   * @defaultValue false
   */
  open?: boolean;
  /**
   * Callback that is called when the app window is opened
   */
  onShow?(): void;
  /**
   * Callback that is called when the app window is closed
   */
  onHide?(): void;
}

/**
 * This component is a wrapper around the App Bridge `s-app-window` element.
 * It is used to display a fullscreen window in the Shopify admin that loads
 * a route of your app from `src`.
 *
 * @see {@link https://shopify.dev/docs/api/app-bridge-library/web-components/s-app-window}
 */
export const AppWindow = forwardRef(function InternalAppWindow(
  {open, onShow, onHide, ...rest}: AppWindowProps,
  forwardedRef: ForwardedRef<SAppWindowElement>,
) {
  const [appWindow, setAppWindow] = useState<SAppWindowElement | null>();

  const refCallback = useCallback(
    (appWindow: SAppWindowElement | null) => {
      setAppWindow(appWindow);
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(appWindow);
        } else {
          forwardedRef.current = appWindow;
        }
      }
    },
    [forwardedRef],
  );

  useEffect(() => {
    if (!appWindow) return;
    if (open) {
      appWindow.show();
    } else {
      appWindow.hide();
    }
  }, [appWindow, open]);

  useEffect(() => {
    if (!appWindow || !onShow) return;
    appWindow.addEventListener('show', onShow);
    return () => {
      appWindow.removeEventListener('show', onShow);
    };
  }, [appWindow, onShow]);

  useEffect(() => {
    if (!appWindow || !onHide) return;
    appWindow.addEventListener('hide', onHide);
    return () => {
      appWindow.removeEventListener('hide', onHide);
    };
  }, [appWindow, onHide]);

  useEffect(() => {
    if (!appWindow) return;
    return () => {
      appWindow.hide();
    };
  }, [appWindow]);

  return <s-app-window {...rest} ref={refCallback} />;
});

AppWindow.displayName = 's-app-window';
