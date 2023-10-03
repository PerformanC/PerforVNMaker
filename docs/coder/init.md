# Coder - Init

## Description

Initialized the internal variables of the code generator and fills the generated code with the basic code of the VN, **necessary** for the proper functioning of the code generator.

## Syntax

```js
coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0',
  optimizations: {
    codeGenTimePositions: true,
    useIntForSwitch: true,
    minify: true,
    reuseResources: true
  }
})
```

## Parameters

- `options`: The options of the VN.
  - `name`: The compact name of the VN is used in the title of the app.
  - `fullName`: The full name of the VN, used in the About menu.
  - `applicationId`: The application ID of the VN is used in the package name of the app.
  - `version`: The version of the VN, used by the system and in the About menu.
  - `optimizations`: The optimizations of the code generator.
    - `codeGenTimePositions`: If `true`, PerforVNM will generate a switch for faster `save` page loading. (high - speed)
    - `useIntForSwitch`: If `true`, the code generator will use `int` instead of `String` for the `switch` in scenes detection. Be aware, this is an agressive optimization, not backward compatible with non-optimized save files, and should be only used if you're sure that you won't change the order of your scenes. (low - speed)
    - `minify`: If `true`, the code generator will minify the generated code by removing the identation spaces. (low - code size)
    - `reuseResources`: If `true`, the code generator will reuse any `sdp` and `ssp` resources that are identical in each scene. (low - speed & code size)

## Return value

This function will return `undefined` if the initialization was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
