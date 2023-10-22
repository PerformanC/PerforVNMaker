# Items - Init

## Description

Initializes the basic variables with information of the items for the functionality of the items core, **necessary** for the use of any items function.

## Syntax

```js
perfor.items.init([{
  id: 'first_item',
  name: 'First item'
}])
```

## Parameters

- `options`: The options of the item.
  - `id`: The unique ID of the item.
  - `name`: The name of the item.

## Return value

This function will return `undefined` if the initialization was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
