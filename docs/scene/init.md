# Scene - Init

## Description

Initializes the basic variables to generate the code, **it is** necessary to use it before using any other function of the code generator of the scenes.

## Syntax

```js
scene.init({
  name: 'scene1',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
})
```

## Parameters

- `options`: The options of the scene.
  - `name`: The name of the scene.
  - `textColor`: The color of the text in the scene.
  - `backTextColor`: The color of the text in the back button.
  - `buttonsColor`: The color of the buttons in the scene.
  - `footerTextColor`: The color of the text in the footer.

## Return value

This function will return the scene configurations if the initialization was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
