import {
  type ReactNode,
  useEffect,
  type LegacyRef,
  useState,
  forwardRef,
  type ForwardedRef,
  Children,
} from 'react';
import ReactDOM from 'react-dom';
import type {UIModalAttributes} from '@shopify/app-bridge-types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-modal': UIModalAttributes & {
        ref?: LegacyRef<UIModalElement | null>;
      };
    }
  }
}

export interface ModalProps extends Omit<UIModalAttributes, 'children'> {
  /**
   * Whether the modal is open or not
   *
   * @defaultValue false
   */
  open?: boolean;
  /**
   * Callback that is called when the modal is opened
   */
  onShow?(): void;
  /**
   * Callback that is called when the modal is closed
   */
  onHide?(): void;
  children?: ReactNode;
}

/**
 * This component is a wrapper around the App Bridge `ui-modal` element.
 * It is used to display an overlay that prevents interaction with the
 * rest of the app until dismissed.
 *
 * @see {@link https://shopify.dev/docs/api/app-bridge-library/react-components/modal}
 */
export const Modal = forwardRef(function InternalModal(
  {open, onShow, onHide, children, ...rest}: ModalProps,
  forwardedRef: ForwardedRef<UIModalElement>,
) {
  const [modal, setModal] = useState<UIModalElement | null>();

  const {titleBar, saveBar, modalContent} = Children.toArray(children).reduce(
    (acc, node) => {
      const nodeName = getNodeName(node);
      const isTitleBar = nodeName === 'ui-title-bar';
      const isSaveBar = nodeName === 'ui-save-bar';
      const belongToModalContent = !isTitleBar && !isSaveBar;
      if (belongToModalContent) {
        acc.modalContent.push(node);
      }
      return {
        ...acc,
        titleBar: isTitleBar ? node : acc.titleBar,
        saveBar: isSaveBar ? node : acc.saveBar,
      };
    },
    {modalContent: []} as {
      titleBar?: ReactNode;
      saveBar?: ReactNode;
      modalContent: ReactNode[];
    },
  );

  const contentPortal =
    modal && modal.content
      ? ReactDOM.createPortal(modalContent, modal.content)
      : null;

  useEffect(() => {
    if (!modal) return;
    if (open) {
      modal.show();
    } else {
      modal.hide();
    }
  }, [modal, open]);

  useEffect(() => {
    if (!modal || !onShow) return;
    modal.addEventListener('show', onShow);
    return () => {
      modal.removeEventListener('show', onShow);
    };
  }, [modal, onShow]);

  useEffect(() => {
    if (!modal || !onHide) return;
    modal.addEventListener('hide', onHide);
    return () => {
      modal.removeEventListener('hide', onHide);
    };
  }, [modal, onHide]);

  useEffect(() => {
    if (!modal) return;
    return () => {
      modal.hide();
    };
  }, [modal]);

  return (
    <ui-modal
      {...rest}
      ref={(modal) => {
        setModal(modal);
        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(modal);
          } else {
            forwardedRef.current = modal;
          }
        }
      }}
    >
      {titleBar}
      {saveBar}
      <div>{contentPortal}</div>
    </ui-modal>
  );
});

Modal.displayName = 'ui-modal';

function getNodeName(node: ReactNode) {
  if (!node) return;
  const rawNodeType =
    typeof node === 'object' && 'type' in node ? node.type : undefined;
  const nodeType = typeof rawNodeType === 'string' ? rawNodeType : undefined;

  const rawDisplayName =
    typeof rawNodeType === 'object'
      ? (rawNodeType as any).displayName
      : undefined;
  const displayName =
    typeof rawDisplayName === 'string' ? rawDisplayName : undefined;

  return nodeType || displayName;
}
