import {createRef} from 'react';
import {AppWindow} from '@shopify/app-bridge-react';

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
      id="bulk-editor"
      src="/bulk-editor"
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
  <s-app-window src="/x" unknownAttribute />
);
// @ts-expect-error `src` is required.
export const appWindowWithoutSrc = <s-app-window />;

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
// @ts-expect-error The ref should point to a SAppWindowElement.
export const appWindowWithWrongRef = <s-app-window src="/x" ref={wrongRef} />;

// The React wrappers accept the same attributes as their elements plus
// `open`/`onShow`/`onHide`, and forward refs to the element type.
export const appWindowComponent = (
  <AppWindow
    id="bulk-editor"
    src="/bulk-editor"
    open
    onShow={() => {}}
    onHide={() => {}}
    ref={createRef<SAppWindowElement>()}
  />
);
// @ts-expect-error `src` is required.
export const appWindowComponentWithoutSrc = <AppWindow id="bulk-editor" />;
export const appWindowComponentWithWrongRef = (
  // @ts-expect-error The ref should point to a SAppWindowElement.
  <AppWindow src="/x" ref={wrongRef} />
);
