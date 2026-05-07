import {describe, it} from 'node:test';
import type {ButtonHTMLAttributes} from 'react';

import {Collection, Product, ProductVariant} from '..';

// Type assertion helper. Will fail if the expression is not of type T.
declare const expect: <T>(expression: T) => {toPass(): void};

describe('App Bridge types', () => {
  it('resourcePicker() returns the resource type based on the given options', async () => {
    const products = await shopify.resourcePicker({type: 'product'});
    expect<Product>(products![0]).toPass();

    const collections = await shopify.resourcePicker({type: 'collection'});
    expect<Collection>(collections![0]).toPass();

    const variants = await shopify.resourcePicker({type: 'variant'});
    expect<ProductVariant>(variants![0]).toPass();
  });

  it('allows UI libraries to narrow their own button props', () => {
    interface LibraryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'ghost' | 'link';
      tone?: 'neutral';
    }

    expect<LibraryButtonProps>({
      type: 'button',
      variant: 'ghost',
      tone: 'neutral',
    }).toPass();
  });
});
