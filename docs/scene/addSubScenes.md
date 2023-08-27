# Scene - Add Sub-scenes

## Description

Adds a fade in transition to the scenes when entering the scene.

## Syntax

```js
scene.addSubScenes(scene, [{ text: 'second', scene: 'scene2' }, { text: 'third', scene: 'scene3' }])
```

OBS: Maximum of 2 sub-scenes, if more are added, PerforVNM will ignore the rest.

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the scenario. An object with the following property:
  - `subScenes`: The sub-scenes configurations.
    - `subScene` is an array of objects with the following properties:
      - `text`: The text that will be displayed in the sub-scene button.
      - `scene`: The name of the scene that will be called when the sub-scene button is pressed.
    - `subScene` is an array of objects with the following properties (2nd sub-scene):
      - `text`: The text that will be displayed in the sub-scene button.
      - `scene`: The name of the scene that will be called when the sub-scene button is pressed.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

OBS: The sub-scenes added will be verified on `finalize` function.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
