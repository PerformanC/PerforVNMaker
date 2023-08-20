# Scene - Init

## Description

Initializes the basic variables to generate the code, **it is** necessary to use it before using any other function of the code generator of the (sub-scenes.

## Syntax

```js
subscene.init({ name: 'scene1' })
```

## Parameters

- `name`: The name of the scene.

## Return value

This function will return the scene configurations if the initialization was successful, otherwise, it will execute `process.exit(1)` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
