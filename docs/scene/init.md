# Scene - Init

## Description

Initializes the basic variables to generate the code, **it is** necessary to use it before using any other function of the code generator of the scenes.

## Syntax

```js
scene.init({ name: 'scene1' })
```

## Parameters

- `name`: The name of the scene.

## Return value

This function will return the scene configurations if the initialization was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
