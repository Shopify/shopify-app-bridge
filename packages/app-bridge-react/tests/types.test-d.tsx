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

const wrongRef = createRef<{notAnAppBridgeElement: true}>();

// @ts-expect-error The ref should point to a UIModalElement.
export const modalWithWrongRef = <ui-modal ref={wrongRef} />;
// @ts-expect-error The ref should point to a UINavMenuElement.
export const navMenuWithWrongRef = <ui-nav-menu ref={wrongRef} />;
// @ts-expect-error The ref should point to a UISaveBarElement.
export const saveBarWithWrongRef = <ui-save-bar ref={wrongRef} />;
// @ts-expect-error The ref should point to a UITitleBarElement.
export const titleBarWithWrongRef = <ui-title-bar ref={wrongRef} />;
