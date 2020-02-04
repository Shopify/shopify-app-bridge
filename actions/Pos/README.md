# Pos

Readonly information when running in Shopify POS - Point of Sale.

## Get device info

```js
app.getState('pos.device').then(function(device) {
  if (!device){
    var unsubscriber = app.subscribe(Pos.ActionType.DEVICE_UPDATE, function(device) {
      console.log('Pos device:', device);
      unsubscriber();
    });
  }
});
```

## Get location info

```js
app.getState('pos.location').then(function(location) {
  if (!location){
    var unsubscriber = app.subscribe(Pos.ActionType.LOCATION_UPDATE, function(location) {
      console.log('Pos location:', location);
      unsubscriber();
    });
  }
});
```

## Get user info

```js
app.getState('pos.user').then(function(user) {
  if (!user){
    var unsubscriber = app.subscribe(Pos.ActionType.USER_UPDATE, function(user) {
      console.log('Pos user:', user);
      unsubscriber();
    });
  }
});
```
