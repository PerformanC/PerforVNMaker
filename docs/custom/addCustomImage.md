# Scene - Add custom image

## Description

Adds a custom image to either `menu` or `scene`.

## Syntax

```js
page.addCustomImage(page, {
  image: 'background_thanking',
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

- `page`: The page configurations from the `init` function.
- `options`: The options of the custom text. An object with the following properties:
  - `image`: The image of the text.
  - `height`: The height of the text. Must be either `match`, `wrap` or a `number`. (dp)
  - `width`: The width of the text. Must be either `match`, `wrap` or a `number`. (dp)
  - `position`: The position of the text. An object with the following properties:
    - `side`: The side of the text can be `left`, `right` or `center`.
    - `margins`: The margin of the text can be any number. An object with the following properties:  (Not required if side == center)
      - `side`: The margin of the side of the text. (dp)
      - `top`: The margin of the top of the text. (dp)


## Return value

This function will return the page configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
