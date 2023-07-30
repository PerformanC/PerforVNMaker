# Coder - Init

## Description

Initialized the internal variables of the code generator and fills the generated code with the basic code of the VN, **necessary** for the proper functioning of the code generator.

## Syntax

```js
coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0'
})
```

## Parameters

- `name`: The compact name of the VN is used in the title of the app.
- `fullName`: The full name of the VN, used in the About menu.
- `applicationId`: The application id of the VN is used in the package name of the app.
- `version`: The version of the VN, used by the system and in the About menu.

## Return value

This function will return `null` if the initialization was successful, otherwise, it will execute `process.exit(1)` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
