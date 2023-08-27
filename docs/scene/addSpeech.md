# Scene - Add speech

## Description

Adds a speech (text box dialog) to the scene.

## Syntax

```js
scene.addSpeech(scene, {
  author: {
    name: 'Pedro',
    textColor: 'FFFFFF',
    rectangle: {
      color: '000000',
      opacity: 0.6
    }
  },
  text: {
    content: '"Welcome to the PerforVNMaker docs."',
    color: 'FFFFFF',
    fontSize: 12,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
}) 
```

## Parameters

- `scene`: The scene configurations from the `init` function.
- `options`: The options of the speech. An object with the following properties:
  - `author`: The author of the speech. An object with the following properties:
    - `name`: The name of the author.
    - `textColor`: The color of the author name.
    - `rectangle`: The rectangle of the author name. An object with the following properties:
      - `color`: The color of the rectangle.
      - `opacity`: The opacity of the rectangle.
  - `text`: The text of the speech. An object with the following properties:
  - `content`: The content of the speech.
  - `color`: The color of the text.
  - `fontSize`: The font size of the text.
  - `rectangle`: The rectangle of the text. An object with the following properties:
    - `color`: The color of the rectangle.
    - `opacity`: The opacity of the rectangle.

## Return value

This function will return the scene configurations if the addition was successful, otherwise, it will execute `new Error` to terminate the generation process.

## Platform support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web
