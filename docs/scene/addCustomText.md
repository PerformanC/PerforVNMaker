# Scene - Add custom text

## Description

Adds a custom text to the scene.

## Syntax

```js
scene.addCustomText(scene, {
  text: 'Hello world!',
  color: 'FFFFFF',
  fontSize: 12,
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
- `options`: The options of the custom text. An object with the following properties:
  - `text`: The text of the text.
  - `color`: The color of the text.
  - `fontSize`: The font size of the text.
  - `height`: The height of the text. Must be either `match`, `wrap` or a `number`. (dp)
  - `width`: The width of the text. Must be either `match`, `wrap` or a `number`. (dp)
  - `position`: The position of the text. An object with the following properties:
    - `side`: The side of the text can be `left`, `right` or `center`.
    - `margins`: The margin of the text can be any number. An object with the following properties:  (Not required if side == center)
      - `side`: The margin of the side of the text. (dp)
      - `top`: The margin of the top of the text. (dp)


## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
