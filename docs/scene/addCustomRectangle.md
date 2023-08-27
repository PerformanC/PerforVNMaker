# Scene - Add custom button

## Description

Adds a custom rectangle to the scene.

## Syntax

```js
scene.addCustomRectangle(scene, {
  color: 'FFFFFF',
  opacity: 0.8,
  height: 'match',
  width: 'match',
  position: {
    side: 'left',
    margins: {
      side: 10,
      top: 10
    }
  }
})
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the custom rectangle. An object with the following properties:
  - `color`: The color of the rectangle.
  - `opacity`: The opacity of the rectangle.
  - `height`: The height of the rectangle. Must be either `match`, `wrap` or a `number`. (dp)
  - `width`: The width of the rectangle. Must be either `match`, `wrap` or a `number`. (dp)
  - `position`: The position of the rectangle. An object with the following properties:
    - `side`: The side of the rectangle can be `left`, `right` or `center`.
    - `margins`: The margin of the rectangle can be any number. An object with the following properties:  (Not required if side == center)
      - `side`: The margin of the side of the rectangle. (dp)
      - `top`: The margin of the top of the rectangle. (dp)

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
