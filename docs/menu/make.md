# Menu - make

## Description

Generates the code of the menu of the VN, and also the about menu, **necessary** for you to be able to use the VN.

OBS: The background image and music must be in the `res/raw` folder.

## Syntax

```js
menu.make({
  textSpeed: 50,
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  aboutText: 'This is the about, welcome.',
  background: {
    image: 'menu',
    music: 'menu_music' // https://www.youtube.com/watch?v=DEhBqcbDHh4
  },
  footer: {
    color: '000000',
    textColor: 'FFFFFFF',
    opacity: 0.8
  }
})
```

## Parameters

- `textSpeed`: The default speed of the scene's speeches.
- `textColor`: The color of the text in the menu.
- `backTextColor`: The color of the text in the back button.
- `aboutText`: The text that will be shown in the About menu.
- `background`: The background of the menu. An object with the following properties:
  - `image`: The background image file name.
  - `music`: The background music file name.
- `footer`: The footer of the menu. An object with the following properties:
  - `color`: The color of the footer.
  - `textColor`: The color of the text in the footer.
  - `opacity`: The opacity of the footer.

## Return value

This function will return `null` if the generation was successful, otherwise, it will execute `process.exit(1)` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
