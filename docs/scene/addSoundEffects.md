# Scene - Add sound effects

## Description

Adds sound effects to the scene, which can be played at any time.

OBS: The sound effect file must be in the `res/raw` folder.

## Warning

Ensure that two sound effect doesn't play at the same time, or it *may* generate audio bugs.

## Syntax

```js
scene.addSoundEffects(scene, [{ sound: 'menu_music', delay: 1000 }])
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the sound effects. An array with the following properties:
  - `soundEffects`: An array of sound effects. Each sound effect must have the following properties:
    - `sound`: The sound effect file name.
    - `delay`: The delay of the sound effect can be any number.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
