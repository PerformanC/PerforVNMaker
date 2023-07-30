# PerforVNMaker - Visual Novel Maker

## Description

PerforVNM is a code generator for VNs that generates native Android code.

## WIP

This project is still under development, missing a lot of features, and it's not ready to be used in production yet.

## Making a VN with PerforVNM?

If you're making a VN with PerforVNM, please contact us, we would love to see your project and make sure that everything is working fine.

Feel free to join [our Discord server](https://discord.gg/uPveNfTuCJ)

## Functions support

### OS support

- [x] Android
- [ ] iOS
- [ ] Windows
- [ ] Linux distros
- [ ] MacOS
- [ ] Web

### Features support

- [x] Scenes
- [x] Characters
- [x] Scenarios
- [x] Menu (In development) (Priority)
- [x] Text box
- [x] Music (Only for the menu. For scenes are in development) (Priority)
- [x] Sound effects
- [x] Transitions (Menu -> about only)
- [ ] Custom paths (+ Priority)
- [ ] Save/Load system (+ Priority)
- [ ] Settings
- [ ] Achievements
- [ ] Inventory
- [ ] Animations
- [ ] Text effects
- [ ] Speech bubbles
- [ ] Text box effects
- [ ] Custom buttons & *View

### Code generation support

- [x] Kotlin
- [ ] Swift / Objective-C
- [ ] C
- [ ] JS, HTML and CSS

## Usage

There are examples of the usage in src/perfornvm.js, but here's a quick example:

```js
import coder from './coder.js'
import scene from './scene.js'
import menu from './menu.js'

coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0'
})

menu.make({
  background: {
    image: 'menu',
    music: 'menu_music'
  },
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  footer: {
    color: '808080',
    textColor: 'FFFFFFF'
  }
}) /* Generates the menu */

let firstScene = scene.init({ name: 'scene1' }) /* Initializes a scene */
firstScene = scene.addCharacter(firstScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'center'
  }
}) /* Adds a character to the scene */
firstScene = scene.addScenario(firstScene, { image: 'background_thanking' }) /* Adds a scenario to the scene */
firstScene = scene.addSpeech(firstScene, {
  author: {
    name: 'Pedro',
    textColor: 'FFFFFF',
    rectangle: {
      color: '000000',
      opacity: 0.6
    }
  },
  text: {
    content: '"Welcome, user. Thanks for testing our code generator, this is an *basic*\n example of usage of the PerforVNM."',
    color: 'FFFFFF',
    fontSize: 12,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
}) /* Adds a speech to the scene */
scene.finalize(firstScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' }) /* Writes the scene */

coder.finalize() /* Finishes up the code */
```

This code will generate an Android native code, with a menu, and a scene with a character, a scenario and a speech.

PerforVNM already takes care of saving the file in the right place for you, so you don't have to worry about that.

Now to build the code, cd into the android folder, and run the command `./gradlew assembleRelease` for release APK and `./gradlew assembleDebug` for debug APK.

After being built, you can access the APK file in the folder `app/build/outputs/apk/`.

## Code generation vs Engine

Engines are always in our lives, and while they're the most used option, for us, PerformanC, they're not the best option.

Engines don't create/convert code to native code, they interpret the code, causing a huge overhead, and making the code slower.

Another reason is that we don't get full control of the code, since we're using an engine, and we can't modify the code as we want.

PerforVNMaker simply generates native code, it's faster than engines, and it's easier to modify the code, and way lighter.

## Support

If you need help with anything, you can ask for help on [our Discord server](https://discord.gg/uPveNfTuCJ), and we will help you with anything you need.

We're cool people, feel free to join us if you only want to talk.

## Feedback

In all sincerity we can have, your feedback is very important to us, so if you have any feedback, you can contact us on [our Discord server](https://discord.gg/uPveNfTuCJ), and we *will* listen to your feedback.

## Contribute to the project

This project is only made by one person, so if you want to contribute, you can do it by making a pull request, and if you want to work on the project, you can contact me on Discord: @pedro.js

## License

PeforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.
