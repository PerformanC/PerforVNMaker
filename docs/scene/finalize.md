# Scene - Finalize

## Description

Finalizes the code and adds the scene code to the main code of the VN.

## Syntax

```js
scene.finalize(scene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' })
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `buttonsColor`: The color of the text in the back button.
- `footerTextColor`: The color of the text in the footer.

## Return value

This function will return `null` if the addition was successful, otherwise, it will execute `process.exit(1)` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
