# Achievements - Init

## Description

Initializes the basic variables with information of the achievements for the functionality of the achievements core, **necessary** for the use of any achievements function.

## Syntax

```js
perfor.achievements.init([{
  id: 'first_achievement',
  name: 'First achievement',
  image: 'achievement'
}])
```

## Parameters

- `options`: The options of the achievements.
  - `id`: The unique ID of the achievement.
  - `name`: The name of the achievement.
  - `image`: The image of the achievement.

## Return value

This function will return `undefined` if the initialization was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
