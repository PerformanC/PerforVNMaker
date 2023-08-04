# Scene - Add character

## Description

Adds a character to the scene, in any position: in the left and right or the center of the scene.

OBS: The character image must be in the `res/raw` folder, and there are no restrictions on how many characters can be added to the scene.

## Syntax

```js
scene.addCharacter(scene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margins: {
      side: 100,
      top: 0
    }
  },
  animation: {
    side: 'right',
    duration: 1000
    margins: {
      side: 100,
      top: 0
    }
  }
})
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `name`: The name of the character.
- `image`: The image of the character.
- `position`: The position of the character. An object with the following properties:
  - `side`: The side of the character can be `left`, `right` or `center`.
  - `margins`: The margin of the character can be any number. An object with the following properties:  (Not required if side == center)
    - `side`: The margin of the side of the character.
    - `top`: The margin of the top of the character.
- `animation`: The animation of the character. An object with the following properties:
  - `side`: The side of the character can be `left`, `right` or `center`.
  - `duration`: The duration of the animation.
  - `margins`: The margin of the character can be any number. An object with the following properties:  (Not required if side == center)
    - `side`: The margin of the side of the character.
    - `top`: The margin of the top of the character.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `process.exit(1)` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
