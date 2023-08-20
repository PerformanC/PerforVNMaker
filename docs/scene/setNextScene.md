# Scene - Set Next Scene

## Description

Adds a fade in transition to the scenes when entering the scene.

## Syntax

```js
scene.setNextScene(scene, 'scene4')
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `nextScene`: The name of the next scene.

## Return value

This function will return the scene configurations if the set was successful, otherwise, it will execute `new Error` to terminate the generation process.

OBS: The sub-scenes added will be verified on `finalize` function.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
