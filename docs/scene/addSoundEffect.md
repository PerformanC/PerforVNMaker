# Scene - Add sound effect

## Description

Adds a sound effect to the scene, which can be played at any time.

OBS: The sound effect file must be in the `res/raw` folder.

## Syntax

```js
scene.addSoundEffect(scene, { sound: 'menu_music', delay: 1000 })
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `sound`: The sound effect file name.
- `delay`: The delay of the sound effect can be any number.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `process.exit(1)` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
