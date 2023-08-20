# Scene - Add transition

## Description

Adds a fade in transition to the scenes when entering the scene.

## Syntax

```js
scene.addTransition(scene, { duration: 1000 })
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `duration`: The duration of the transition.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
