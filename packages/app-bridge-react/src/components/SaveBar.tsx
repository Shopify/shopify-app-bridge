import {
  type ReactNode,
  useEffect,
  type LegacyRef,
  useState,
  forwardRef,
  type ForwardedRef,
} from 'react';
import type {UISaveBarAttributes} from '@shopify/app-bridge-types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-save-bar': UISaveBarAttributes & {
        ref?: LegacyRef<UISaveBarElement | null>;
      };
    }
  }
}

export interface SaveBarProps extends Omit<UISaveBarAttributes, 'children'> {
  /**
   * Whether the saveBar is open or not
   *
   * @defaultValue false
   */
  open?: boolean;
  /**
   * Callback that is called when the saveBar is opened
   */
  onShow?(): void;
  /**
   * Callback that is called when the saveBar is closed
   */
  onHide?(): void;
  children?: ReactNode;
}

/**
 * This component is a wrapper around the App Bridge `ui-save-bar` element.
 * It is used to display a contextual save bar to signal dirty state in the app.
 *
 * @see {@link https://shopify.dev/docs/api/app-bridge-library/react-components/save-bar}
 */
export const SaveBar = forwardRef(function InternalSaveBar(
  {open, onShow, onHide, children, ...rest}: SaveBarProps,
  forwardedRef: ForwardedRef<UISaveBarElement>,
) {
  const [saveBar, setSaveBar] = useState<UISaveBarElement | null>();

  useEffect(() => {
    if (!saveBar) return;
    if (open) {
      saveBar.show();
    } else {
      saveBar.hide();
    }
  }, [saveBar, open]);

  useEffect(() => {
    if (!saveBar || !onShow) return;
    saveBar.addEventListener('show', onShow);
    return () => {
      saveBar.removeEventListener('show', onShow);
    };
  }, [saveBar, onShow]);

  useEffect(() => {
    if (!saveBar || !onHide) return;
    saveBar.addEventListener('hide', onHide);
    return () => {
      saveBar.removeEventListener('hide', onHide);
    };
  }, [saveBar, onHide]);

  useEffect(() => {
    if (!saveBar) return;
    return () => {
      saveBar.hide();
    };
  }, [saveBar]);

  return (
    <ui-save-bar
      {...rest}
      ref={(saveBar) => {
        setSaveBar(saveBar);
        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(saveBar);
          } else {
            forwardedRef.current = saveBar;
          }
        }
      }}
    >
      {children}
    </ui-save-bar>
  );
});

SaveBar.displayName = 'ui-save-bar';
