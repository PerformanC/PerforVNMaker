# Scene - Add Sub-scenes

## Description

Adds a fade in transition to the scenes when entering the scene.

## Syntax

```js
scene.addSubScenes(scene, [{
    text: 'second',
    scene: 'scene2',
    item: {
      require: 'first_item'
      remove: true
    }
  }, {
    text: 'third',
    scene: 'scene3'
  }
])
```

OBS: Maximum of 2 sub-scenes, if more are added, PerforVNM will ignore the rest.

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the scenario. An object with the following property:
  - `subScenes`: The array of sub-scenes configurations (2)
    - `subScene` is an array of objects with the following properties:
      - `text`: The text that will be displayed in the sub-scene button.
      - `scene`: The name of the scene that will be called when the sub-scene button is pressed.
      - `item`: The item configurations. An object with the following properties:
        - `require`: The item that is required to go to the next scene. An object with the following properties:
          - `id`: The unique ID of the item.
          - `fallback`: The scene that will be called if the player does not have the item.
        - `remove`: If the item will be removed from the player's inventory.

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
