# Scene - Finalize

## Description

Finalizes the code and adds the scene code to the main code of the VN.

## Syntax

```js
scene.finalize(scene, {
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
})
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the scene.
  - `textColor`: The color of the text in the scene.
  - `backTextColor`: The color of the text in the back button.
  - `buttonsColor`: The color of the buttons in the scene.
  - `footerTextColor`: The color of the text in the footer.


## Return value

This function will return `undefined` if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
