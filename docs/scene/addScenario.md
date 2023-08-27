# Scene - Add scenario

## Description

Adds a scenario (background image) to the scene.

OBS: The scenario image must be in the `res/raw` folder.

## Syntax

```js
scene.addScenario(scene, { image: 'background_thanking' })
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the scenario. An object with the following property:
  - `image`: The image of the scenario.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
