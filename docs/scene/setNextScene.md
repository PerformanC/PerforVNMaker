# Scene - Set Next Scene

## Description

Adds a fade in transition to the scenes when entering the scene.

## Syntax

```js
scene.setNextScene(scene, {
  scene: 'scene4',
  item: {
    require: {
      id: 'first_item',
      fallback: 'no_items'
    },
    remove: true
  }
})
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the scenario. An object with the following property:
  - `scene`: The name of the scene that will be called when the scene ends.
  - `item`: The item configurations. An object with the following properties:
    - `require`: The item that is required to go to the next scene. An object with the following properties:
      - `id`: The unique ID of the item.
      - `fallback`: The scene that will be called if the player does not have the item.
    - `remove`: If the item will be removed from the player's inventory.

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
