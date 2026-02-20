import {describe, it} from 'node:test';

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
});
