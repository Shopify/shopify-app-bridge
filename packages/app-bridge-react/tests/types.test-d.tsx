import {createRef} from 'react';
import type {} from '@shopify/app-bridge-react';

export const elements = (
  <>
    <ui-modal
      id="product-modal"
      variant="large"
      src="/products"
      ref={createRef<UIModalElement>()}
    />
    <ui-nav-menu ref={createRef<UINavMenuElement>()} />
    <ui-save-bar
      id="product-save-bar"
      discardConfirmation
      ref={createRef<UISaveBarElement>()}
    />
    <ui-title-bar title="Products" ref={createRef<UITitleBarElement>()} />
    <s-app-nav ref={createRef<SAppNavElement>()}>
      <a href="/" rel="home">
        Home
      </a>
    </s-app-nav>
    <s-app-window
      id="product-window"
      src="/products"
      ref={createRef<SAppWindowElement>()}
    />
  </>
);

// @ts-expect-error Unknown attributes should not be accepted.
export const modalWithUnknownAttribute = <ui-modal unknownAttribute />;
// @ts-expect-error Unknown attributes should not be accepted.
export const navMenuWithUnknownAttribute = <ui-nav-menu unknownAttribute />;
// @ts-expect-error Unknown attributes should not be accepted.
export const saveBarWithUnknownAttribute = <ui-save-bar unknownAttribute />;
// @ts-expect-error Unknown attributes should not be accepted.
export const titleBarWithUnknownAttribute = <ui-title-bar unknownAttribute />;
// @ts-expect-error Unknown attributes should not be accepted.
export const appNavWithUnknownAttribute = <s-app-nav unknownAttribute />;
export const appWindowWithUnknownAttribute = (
  // @ts-expect-error Unknown attributes should not be accepted.
  <s-app-window src="/products" unknownAttribute />
);

const wrongRef = createRef<{notAnAppBridgeElement: true}>();

// @ts-expect-error The ref should point to a UIModalElement.
export const modalWithWrongRef = <ui-modal ref={wrongRef} />;
// @ts-expect-error The ref should point to a UINavMenuElement.
export const navMenuWithWrongRef = <ui-nav-menu ref={wrongRef} />;
// @ts-expect-error The ref should point to a UISaveBarElement.
export const saveBarWithWrongRef = <ui-save-bar ref={wrongRef} />;
// @ts-expect-error The ref should point to a UITitleBarElement.
export const titleBarWithWrongRef = <ui-title-bar ref={wrongRef} />;
// @ts-expect-error The ref should point to an SAppNavElement.
export const appNavWithWrongRef = <s-app-nav ref={wrongRef} />;
export const appWindowWithWrongRef = (
  // @ts-expect-error The ref should point to an SAppWindowElement.
  <s-app-window src="/products" ref={wrongRef} />
);
