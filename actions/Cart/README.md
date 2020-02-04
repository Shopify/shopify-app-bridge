# Cart

The `Cart` action set lets you view and modify customer checkout cart data within the Shopify Point of Sale app.

## Requirements

These actions require the following app versions:

* **Point of Sale iOS v5.11.0** or above
* **Point of Sale Android v3.3.2** or above

## Setup

Create an app and import the `Cart` module from `@shopify/app-bridge/actions`. Note that we'll be referring to this sample application throughout the examples below.

```js
import createApp from '@shopify/app-bridge';
import {Cart} from '@shopify/app-bridge/actions';

var app = createApp({
  apiKey: '12345',
});
```

## Create a cart

Create a cart and subscribe to cart updates:

```js
var cart = Cart.create(app);
cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] cart update', payload);
});
```

## Handling error

```js
app.error(function (data: Error.ErrorAction) {
  console.info('[client] Error received: ', data);
});
```

## Feature Detection

Cart actions are available only on the Shopify Point of Sale app, so it’s a good idea to check if an action is available before you call it. This makes sure that you're able to display the appropriate UI when a feature is or is not available. To learn more about Feature Detection, see [*Features*](/api/embedded-apps/app-bridge/actions/features).

The following example shows how you could use Feature Detection with cart actions by requesting if `Cart.Action.FETCH` is available and using the result to alter your UI.

Start off by requesting if the cart group is available:

```js
app.featuresAvailable([Group.Cart]).then(function (state) {...});
```

The promise block resolves to a state object containing the status of the cart actions. Query for `Cart.Action.FETCH` and then `Dispatch` inside that object. If it's `true`, follow the instructions below for [Fetch cart](#fetch-cart). If it's `false`, the cart action is not available in this context. Using this approach, it’s possible to distinguish between an empty cart and a context where cart is not available.

```js
app.featuresAvailable(Group.Cart).then(function (state) {
  var _ref = state.Cart && state.Cart[Cart.Action.FETCH],
      Dispatch = _ref.Dispatch;

  if (Dispatch) {
    cart.dispatch(Cart.Action.FETCH);
  } else {
    var toastOptions = {
      message: 'Cart is not available',
      duration: 5000,
      isError: true
    };
    var toastError = Toast.create(app, toastOptions);
    toastError.dispatch(Toast.Action.SHOW);
  }
});
```

## Update cart

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>UPDATE</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::UPDATE</td>
  </tr>
  <tr>
    <th>Description</th><td>Retrieves the latest state of the currently active cart from Shopify POS.</td>
  </tr>
</table>

Subscribing to this action provides you with cart updates.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] fetchCart', payload);
  unsubscriber();
});
// ...
// Call other Cart actions
```

### NoteAttribute Payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td>String</td>
      <td>The name of the attribute.</td>
    </tr>
    <tr>
      <td><code>value</code></td>
      <td>String</td>
      <td>The value of the attribute.</td>
    </tr>
  </tbody>
</table>

### Response

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>subtotal</code></td>
      <td>String</td>
      <td>The total cost of the current cart including discounts, but before taxes and shipping. Value is based on the shop's existing currency settings.</td>
    </tr>
    <tr>
      <td><code>taxTotal</code></td>
      <td>String</td>
      <td>The sum of taxes for the current cart. Value is based on the shop's existing currency settings.</td>
    </tr>
    <tr>
      <td><code>grandTotal</code></td>
      <td>String</td>
      <td>The total cost of the current cart, after taxes and discounts have been applied. Value is based on the shop's existing currency settings.</td>
    </tr>
    <tr>
      <td><code>customer</code></td>
      <td><a href="#customer-payload">Customer?</a></td>
      <td>The customer associated to the current cart.</td>
    </tr>
    <tr>
      <td><code>lineItems</code></td>
      <td>Array[<a href="#lineItem-payload">LineItem</a>]</td>
      <td>A list of lineItem objects.</td>
    </tr>
    <tr>
      <td><code>noteAttributes</code></td>
      <td>Array[<a href="#noteAttribute-payload">NoteAttribute</a>]?</td>
      <td>A list of objects containing cart properties.</td>
    </tr>
    <tr>
      <td><code>cartDiscount</code></td>
      <td><a href="#discount-payload">Discount?</a></td>
      <td>The current discount applied to the entire cart.</td>
    </tr>
    <tr>
      <td><code>note</code></td>
      <td>String?</td>
      <td>A note associated with the cart.</td>
    </tr>
  </tbody>
</table>

## Fetch cart

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>FETCH</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::FETCH</td>
  </tr>
  <tr>
    <th>Description</th><td>Requests the currently active cart from Shopify POS.</td>
  </tr>
</table>

A cart needs to call fetch before receiving data in `Cart.Action.UPDATE`:

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] fetchCart', payload);
  unsubscriber();
});
cart.dispatch(Cart.Action.FETCH);
```

## Set customer

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>SET_CUSTOMER</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::SET_CUSTOMER</td>
  </tr>
  <tr>
    <th>Description</th><td>Sets a customer on the current cart.</td>
  </tr>
</table>

This is the customer that will be attached to the cart and subsequent order. You can either set a customer with an existing customer ID or create a new customer.

Existing customer with ID:

```js
var customerPayload = {
    id: 123
};
```

New customer:

```js
var customerPayload = {
    email: 'voisin@gmail.com',
    firstName: 'Sandrine',
    lastName: 'Voisin',
    note: 'First customer of 2019',
};
```

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] setCustomer', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.setCustomer(customerPayload),
);
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td><a href="#customer-payload">Customer</a></td>
      <td>The customer data.</td>
    </tr>
  </tbody>
</table>

### Customer Payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td>Number?</td>
      <td>The ID of existing customer.</td>
    </tr>
    <tr>
      <td><code>email</code></td>
      <td>String?</td>
      <td>The email for new customer.</td>
    </tr>
    <tr>
      <td><code>firstName</code></td>
      <td>String?</td>
      <td>The first name for new customer.</td>
    </tr>
    <tr>
      <td><code>lastName</code></td>
      <td>String?</td>
      <td>The last name for new customer.</td>
    </tr>
    <tr>
      <td><code>note</code></td>
      <td>String?</td>
      <td>The note for new customer.</td>
    </tr>
  </tbody>
</table>

## Add customer address

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>ADD_CUSTOMER_ADDRESS</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::ADD_CUSTOMER_ADDRESS</td>
  </tr>
  <tr>
    <th>Description</th><td>Adds a new address on the customer associated with the current cart.</td>
  </tr>
</table>

> Note: A customer must exist on the cart for this action to be successful.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] addCustomerAddress', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.addCustomerAddress({
    address1: '528 Old Weston Road',
    address2: 'Apartment 201',
    city: 'Toronto',
    company: 'Eliteweb Inc.',
    country: 'Canada',
    countryCode: 'CA',
    firstName: 'Sandrine',
    lastName: 'Voisin',
    name: 'Sandrine Voisin',
    phone: '416 684 1787',
    province: 'Ontario',
    provinceCode: 'ON',
    zip: 'M6N 3B1',
  }),
);
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td><a href="#address-payload">Address</a></td>
      <td>The data for creating a new address.</td>
    </tr>
  </tbody>
</table>

### Address Payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>address1</code></td>
      <td>String?</td>
      <td>The customer's primary address.</td>
    </tr>
    <tr>
      <td><code>address2</code></td>
      <td>String?</td>
      <td>Any extra information associated with the address (Apartment #, Suite #, Unit #, etc.).</td>
    </tr>
    <tr>
      <td><code>city</code></td>
      <td>String?</td>
      <td>The name of the customer's city.</td>
    </tr>
    <tr>
      <td><code>company</code></td>
      <td>String?</td>
      <td>The company name associated with address.</td>
    </tr>
    <tr>
      <td><code>firstName</code></td>
      <td>String?</td>
      <td>The first name of the customer.</td>
    </tr>
    <tr>
      <td><code>lastName</code></td>
      <td>String?</td>
      <td>The last name of the customer.</td>
    </tr>
    <tr>
      <td><code>phone</code></td>
      <td>String?</td>
      <td>The phone number of the customer.</td>
    </tr>
    <tr>
      <td><code>province</code></td>
      <td>String?</td>
      <td>The province or state of the address.</td>
    </tr>
    <tr>
      <td><code>country</code></td>
      <td>String?</td>
      <td>The country of the address.</td>
    </tr>
    <tr>
      <td><code>zip</code></td>
      <td>String?</td>
      <td>The ZIP or postal code of the address.</td>
    </tr>
    <tr>
      <td><code>name</code></td>
      <td>String?</td>
      <td>The name of the address.</td>
    </tr>
    <tr>
      <td><code>provinceCode</code></td>
      <td>String?</td>
      <td>The acronym of the province or state.</td>
    </tr>
    <tr>
      <td><code>countryCode</code></td>
      <td>String?</td>
      <td>The Country Code in ISO 3166-1 (alpha-2) format.</td>
    </tr>
  </tbody>
</table>

## Update customer address

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>UPDATE_CUSTOMER_ADDRESS</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::UPDATE_CUSTOMER_ADDRESS</td>
  </tr>
  <tr>
    <th>Description</th><td>Updates a new address on the customer associated with the current cart.</td>
  </tr>
</table>

> Note: The first parameter is the index of the customer address you're updating. If there is no address at that index, this action will not be successful.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] updateCustomerAddress', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.updateCustomerAddress(0, {
    address1: '528 Old Weston Road',
    address2: 'Apartment 201',
    city: 'Toronto',
    company: 'Eliteweb Inc.',
    country: 'Canada',
    countryCode: 'CA',
    firstName: 'Sandrine',
    lastName: 'Voisin',
    name: 'Sandrine Voisin',
    phone: '416 684 1787',
    province: 'Ontario',
    provinceCode: 'ON',
    zip: 'M6N 3B1',
  }),
);
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>index</code></td>
      <td>Number</td>
      <td>The index of the address to update.</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td><a href="#address-payload">Address</a></td>
      <td>The fields of the address to update.</td>
    </tr>
  </tbody>
</table>

## Remove customer

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>REMOVE_CUSTOMER</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::REMOVE_CUSTOMER</td>
  </tr>
  <tr>
    <th>Description</th><td>Removes a customer from the current cart.</td>
  </tr>
</table>

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] removeCustomer', payload);
  unsubscriber();
});
cart.dispatch(Cart.Action.REMOVE_CUSTOMER);
```

## Set discount

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>SET_DISCOUNT</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::SET_DISCOUNT</td>
  </tr>
  <tr>
    <th>Description</th><td>Sets a discount on the current cart.</td>
  </tr>
</table>

You can apply a discount to the entire cart, which will affect all line items. There are several different types of discounts. See below for an example of each type.

Flat amount discount:

```js
var discountPayload = {
  amount: '1',
  discountDescription: "$1 off discount",
  type: 'flat',
}
```

Percentage discount:

> Note: The `amount` is a float value where 1.0 is a 100% discount and 0.0 is a 0% discount.

```js
var discountPayload = {
  amount: '0.5',
  discountDescription: "50% off discount",
  type: 'percent',
}
```

Discount code discount:

```js
var discountPayload = {
  discountDescription: "Holiday Sale",
  discountCode: 'HOLIDAYSALE50',
}
```

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] setDiscount', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.setDiscount(discountPayload),
);
```

### Discount Amount Payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>amount</code></td>
      <td>Number</td>
      <td>The discount amount to be applied to the subtotal of the cart as a flat value or total percentage discount. flat discount amounts must be greater than 0. Discounts greater than the subtotal of the cart will be reduced to the subtotal amount. percent discount amounts must be between 0.0 and 1.0.</td>
    </tr>
    <tr>
      <td><code>discountDescription</code></td>
      <td>String?</td>
      <td>A description of the discount being applied. Defaults to Discount, if not supplied.</td>
    </tr>
    <tr>
      <td><code>type</code></td>
      <td>String?</td>
      <td>The discount type. The options are flat or percent. Defaults to flat, if not supplied.</td>
    </tr>
  </tbody>
</table>

### Discount Code Payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>discountCode</code></td>
      <td>String</td>
      <td>The discount code to apply to the current cart.</td>
    </tr>
  </tbody>
</table>

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td><a href="#discount-amount-payload">DiscountAmount</a> | <a href="#discount-code-payload">DiscountCode</a></td>
      <td>The type of discount to apply to the current cart.</td>
    </tr>
  </tbody>
</table>

## Remove discount

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>REMOVE_DISCOUNT</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::REMOVE_DISCOUNT</td>
  </tr>
  <tr>
    <th>Description</th><td>Removes a discount from the current cart.</td>
  </tr>
</table>

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] removeDiscount', payload);
  unsubscriber();
});
cart.dispatch(Cart.Action.REMOVE_DISCOUNT);
```

## Set cart properties

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>SET_PROPERTIES</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::SET_PROPERTIES</td>
  </tr>
  <tr>
    <th>Description</th><td>Adds additional properties to the current cart.</td>
  </tr>
</table>

> Note: Each key/value pair in the payload is a single property.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] setProperties', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.setProperties({
    referral: 'Shopify',
    userID: '1234',
  }),
);
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td>Object</td>
      <td>The key-value pairs of properties to add to the current cart.</td>
    </tr>
  </tbody>
</table>

## Remove cart properties

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>REMOVE_PROPERTIES</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::REMOVE_PROPERTIES</td>
  </tr>
  <tr>
    <th>Description</th><td>Removes one or more properties from the current cart.</td>
  </tr>
</table>

> Note: When removing properties, reference the key of the property. In the example above, two properties were set on the cart, with keys **referral** and **userID**. Pass in either of those values to remove them.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] removeProperties', payload);
  unsubscriber();
});
cart.dispatch(Cart.removeProperties(['referral', 'userID']));
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td>Array</td>
      <td>A list of properties to remove from the current cart.</td>
    </tr>
  </tbody>
</table>

## Add line item

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>ADD_LINE_ITEM</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::ADD_LINE_ITEM</td>
  </tr>
  <tr>
    <th>Description</th><td>Adds a new line item to the current cart.</td>
  </tr>
</table>

Line items can be added to the cart in two different ways: as a variant of a product, or as a quick sale item (usually used for one-off sales on items not backed by a variant).

Quick Sale line item:

```js
var lineItemPayload = {
  price: '20',
  quantity: 1,
  title: 'Bab Low - Blue Jay // White Soles',
};
```

Variant line item:

```js
var lineItemPayload = {
  variantId: '1234',
  quantity: 1
};
```

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] addLineItem', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.addLineItem(lineItemPayload),
);
```

### Line item Payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>price</code></td>
      <td>Number?</td>
      <td>The price of the line item. Required if a <code>variantId</code> is not provided. Must be greater than <code>0</code>.</td>
    </tr>
    <tr>
      <td><code>quantity</code></td>
      <td>Number</td>
      <td>The amount of items to add. Defaults to <code>1</code> if not provided. Must be greater than <code>0</code>.</td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>String?</td>
      <td>The name of the product, defaults to <code>"Quick sale"</code> if not supplied.</td>
    </tr>
    <tr>
      <td><code>variantId</code></td>
      <td>Number?</td>
      <td>The unique ID of the variant being added. If not included, the product will be considered a custom sale.</td>
    </tr>
    <tr>
      <td><code>discount</code></td>
      <td><a href="#discount-amount-payload">DiscountAmount?</a></td>
      <td>A discount to apply to the line item.</td>
    </tr>
  </tbody>
</table>

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td><a href="#lineItem-payload">LineItem</a></td>
      <td>The data for creating a new line item in the current cart.</td>
    </tr>
  </tbody>
</table>

## Update line item

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>UPDATE_LINE_ITEM</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::UPDATE_LINE_ITEM</td>
  </tr>
  <tr>
    <th>Description</th><td>Updates an existing line item quantity in the cart.</td>
  </tr>
</table>

> Note: The first parameter is the index of the line item to update. If there is no line item at that index, this action will not be successful. **Only** the `quantity` property can be updated.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] updateLineItem', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.updateLineItem(0, {
    quantity: 100,
  }),
);
```

### Line item update payload

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>quantity</code></td>
      <td>Number</td>
      <td>The amount of items to add. Must be greater than <code>0</code>.</td>
    </tr>
  </tbody>
</table>

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>index</code></td>
      <td>Number</td>
      <td>Index of line item to update</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td><a href="#lineItem-update-payload">Line Item Update</a></td>
      <td>The data for updating a line item at the specified index.</td>
    </tr>
  </tbody>
</table>

## Remove line item

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>REMOVE_LINE_ITEM</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::REMOVE_LINE_ITEM</td>
  </tr>
  <tr>
    <th>Description</th><td>Removes an existing line item from the cart.</td>
  </tr>
</table>

> Note: The first parameter is the index of the line item to remove. If there is no line item at that index, this action will not be successful.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] removeLineItem', payload);
  unsubscriber();
});
cart.dispatch(Cart.removeLineItem(0));
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>index</code></td>
      <td>Number</td>
      <td>The index of line item to remove.</td>
    </tr>
  </tbody>
</table>

## Set line item discount

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>SET_LINE_ITEM_DISCOUNT</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::SET_LINE_ITEM_DISCOUNT</td>
  </tr>
  <tr>
    <th>Description</th><td>Sets the discount on a line item in the current cart.</td>
  </tr>
</table>

Unlike cart discounts, line item discounts can't use discount codes. They support only flat amount discounts and percentage discounts.

> Note: The first parameter is the index of the line item to applying the discount to. If there is no line item at that index, this action will not be successful.

Flat amount discount:

```js
var discountPayload = {
  amount: '1',
  discountDescription: "$1 off discount",
  type: 'flat',
}
```

Percentage discount:

> Note: The `amount` is a float value where 1.0 is a 100% discount and 0.0 is a 0% discount.

```js
var discountPayload = {
  amount: '0.5',
  discountDescription: "50% off discount",
  type: 'percent',
}
```

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] setLineItemDiscount', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.setLineItemDiscount(0, discountPayload),
);
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>index</code></td>
      <td>Number</td>
      <td>The index of the line item to apply the discount to.</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td><a href="#discount-amount-payload">DiscountAmount</a></td>
      <td>The discount to apply to the line item.</td>
    </tr>
  </tbody>
</table>

## Remove line item discount

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>REMOVE_LINE_ITEM_DISCOUNT</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::REMOVE_LINE_ITEM_DISCOUNT</td>
  </tr>
  <tr>
    <th>Description</th><td>Removes a line item discount in the current cart.</td>
  </tr>
</table>

> Note: The first parameter is the index of which line item we're removing a discount from. If there is no line item at that index then this action will not be successful.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] removeLineItemDiscount', payload);
  unsubscriber();
});
cart.dispatch(Cart.removeLineItemDiscount(0));
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>index</code></td>
      <td>Number</td>
      <td>The index of the line item to remove the discount from.</td>
    </tr>
  </tbody>
</table>

## Set line item properties

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>SET_LINE_ITEM_PROPERTIES</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::SET_LINE_ITEM_PROPERTIES</td>
  </tr>
  <tr>
    <th>Description</th><td>Adds a property to a given line item in the current cart.</td>
  </tr>
</table>

> Note: The first parameter is the index of which line item we're setting properties on. If there is no line item at that index then this action will not be successful.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] setLineItemProperties', payload);
  unsubscriber();
});
cart.dispatch(
  Cart.setLineItemProperties(0, {
    referral: 'Shopify',
    userID: '1234',
  }),
);
```

> Note: Each key/value pair in the payload is a single property.

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>data</code></td>
      <td>Object</td>
      <td>The key-value pairs of properties to add to the specified line item.</td>
    </tr>
  </tbody>
</table>

## Remove line item properties

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>REMOVE_LINE_ITEM_PROPERTIES</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::REMOVE_LINE_ITEM_PROPERTIES</td>
  </tr>
  <tr>
    <th>Description</th><td>Removes a property from a given line item in the current cart.</td>
  </tr>
</table>

> Note: The first parameter is the index of which line item we're removing properties from. If there is no line item at that index then this action will not be successful.

When removing properties, reference the key of property. In the properties that were set on the cart above, the keys were: **referral** and **userID**. You can pass in either of those values to remove them.

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] removeLineItemProperties', payload);
  unsubscriber();
});
cart.dispatch(Cart.removeLineItemProperties(0, ['referral', 'userID']));
```

### Request

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>index</code></td>
      <td>Number</td>
      <td>The index of the line item to remove properties from.</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td>Array[String]</td>
      <td>A list of properties to remove from the specified line item.</td>
    </tr>
  </tbody>
</table>

## Clear cart

<table>
  <tr>
    <th>Group</th><td>Cart</td>
  </tr>
  <tr>
    <th>Action</th><td>CLEAR</td>
  </tr>
  <tr>
    <th>Action Type</th><td>APP::CART::CLEAR</td>
  </tr>
  <tr>
    <th>Description</th><td>Remove all line items from the current cart.</td>
  </tr>
</table>

```js
var unsubscriber = cart.subscribe(Cart.Action.UPDATE, function (payload: Cart.Payload) {
  console.log('[Client] clear', payload);
  unsubscriber();
});
cart.dispatch(Cart.Action.CLEAR);
```