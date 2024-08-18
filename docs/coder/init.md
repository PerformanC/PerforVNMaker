# Coder - Init

## Description

Initialized the internal variables of the code generator and fills the generated code with the basic code of the VN, **necessary** for the proper functioning of the code generator.

## Syntax

```js
coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  id: 'perforvnm',
  applicationId: 'com.perforvnm',
  version: '1.0.0',
  developer: 'The PerformanC Organization',
  optimizations: {
    preCalculateScenesInfo: true,
    preCalculateRounding: true,
    hashAchievementIds: true,
    hashScenesNames: true,
    reuseResources: true,
    hashItemIds: true,
    minify: true
  }
})
```

## Parameters

- `options`: The options of the VN.
  - `name`: The compact name of the VN is used in the title of the app.
  - `fullName`: The full name of the VN, used in the About menu.
  - `id`: Short name, used in the package areas. Must not contain spaces or special characters.
  - `applicationId`: The application ID of the VN is used in the package name of the app.
  - `version`: The version of the VN, used by the system and in the About menu.
  - `developer`: The name of the developer responsable for the VN, used for MacOS copyright.
  - `optimizations`: The optimizations of the code generator.
    - `preCalculateScenesInfo`: If `true`, PerforVNM will process some scene infos at the code generation time instead of at runtime. (low - speed)
    - `preCalculateRounding`: If `true`, PerforVNM will generate a switch with pre-calculated rouded `sdp`s for faster `save` page loading. (high - speed)
    - `hashScenesNames`: If `true`, the code generator, in code generation time, will hash the names of the scenes in `saves` switch page to reduce overhead of checking strings.
    - `hashAchievementIds`: If `true`, the code generator, in code generation time, will hash the IDs of the achievements in `achievements` switch page to reduce overhead of checking strings.
    - `reuseResources`: If `true`, the code generator will reuse any `sdp` and `ssp` resources that are identical in each scene. (low - speed & code size)
    - `hashItemIds`: If `true`, the code generator, in code generation time, will hash the IDs of the items in `items` switch page to reduce overhead of checking strings.
    - `minify`: If `true`, the code generator will minify the generated code by removing the identation spaces. (low - code size)

## Return value

This function will return `undefined` if the initialization was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
