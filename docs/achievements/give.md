# Achievements - Give

## Description

Sets to give the player an achievement when the player reaches the scene.

## Syntax

```js
perfor.achievements.give(scene, 'first_achievement')

```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `id`: The unique ID of the achievement to give.

## Return value

This function will return the scene configurations if successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
