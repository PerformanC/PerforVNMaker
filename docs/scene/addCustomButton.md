# Scene - Add custom button

## Description

Adds a custom button to the scene.

## Syntax

```js
scene.addCustomButton(scene, {
  text: 'Hello world!',
  color: 'FFFFFF',
  fontSize: 12,
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
- `options`: The options of the custom button. An object with the following properties:
  - `text`: The text of the button.
  - `color`: The color of the button.
  - `fontSize`: The font size of the text.
  - `height`: The height of the button. Must be either `match`, `wrap` or a `number`. (dp)
  - `width`: The width of the button. Must be either `match`, `wrap` or a `number`. (dp)
  - `position`: The position of the button. An object with the following properties:
    - `side`: The side of the button can be `left`, `right` or `center`.
    - `margins`: The margin of the button can be any number. An object with the following properties:  (Not required if side == center)
      - `side`: The margin of the side of the button. (dp)
      - `top`: The margin of the top of the button. (dp)


## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
