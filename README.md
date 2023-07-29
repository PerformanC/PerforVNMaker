# PerforVNMaker - Visual Novel Maker

## Description

PerforVNM is a code generator for VNs that generates native Android code.

## WIP

This project is still under development, missing a lot of features, and it's not ready to be used in production yet.

## Making a VN with PerforVNM?

If you're making a VN with PerforVNM, please contact us, we would love to see your project and make sure that everything is working fine.

Feel free to join [our Discord server](https://discord.gg/uPveNfTuCJ)

## Support

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
- [ ] Save/Load system (Priority)
- [ ] Settings
- [ ] Achievements
- [ ] Inventory
- [x] Music (Only for menu. For scenes are in development) (Priority)
- [ ] Sound effects
- [ ] Animations
- [ ] Transitions (Priority)
- [ ] Text effects
- [ ] Speech bubbles
- [x] Text box
- [ ] Text box effects

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
scene.finalize(firstScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' }) /* Writes the scene */

coder.finalize() /* Finishes up the code */
```

This will generate a Kotlin file, native Android code, with the name of the project, the version, the applicationId, the scenes, the characters, the scenarios and the menu.

It will be saved to the corresponding folder of android folder, and it will be ready to be built. You can build it by using Gradlew, with the command `./gradlew assembleRelease`.

After being built, you can access the APK file in the folder `app/build/outputs/apk/`.

## Advantages and disadvantages vs other VNMs

PerforVNM is new, missing a lot of features, would be unfair to compare feature terms with other VNMs, but here's a list of advantages and disadvantages of PerforVNM vs other VNMs (without features):

### Weight

Different from other VNMs that use an engine, PerforVNM generates native code. This means that the APK file will be lighter than other VNMs, because it doesn't need to have an engine to run the game.

### Performance

Making the name of the organization, PerforVNM focuses on performance, so the generated code will be faster than other VNMs, using less resources.

### Easy of use

PerforVNM is easy to use, it will handle optimizations for you internally, making sure that the output code will be the best possible.

### Customization

PerforVNM misses customizations because it's new, but it will have a lot of customizations in the future, and it will be easy to customize the output code.

## Code generation vs Engine

When we're thinking of the side of the project developer, using an engine is easier, since you don't need about making the code, you just need to use the engine, and the engine will handle everything for you.

But when we're thinking of the side of the user, using an engine is worse, since the engine will use more resources, and it will be slower than native code.

Engines are a good option for projects that don't want to spend a lot of time on the project and learn new languages.

The PerformanC team prefers to use native code because it's faster, it uses fewer resources, and it's easier to optimize and modify anything we want.

### Bugs

Engines are less likely to have bugs, since they're used by a lot of people, and they're tested by a lot of people, but when they have bugs, it's harder to fix them, since you don't have direct access to the source code.

Our code is more likely to have bugs since it's new, and it's not tested by a lot of people, but when it has bugs, it's easier to fix them, since we have access to the source code.

### Community support

Engines / Most VNMs have a lot of community support since they're used by a lot of people, and they have a lot of people working on them.

If you stick with us, you'll have less community support from people outside PerformanC.

## Support

If you need help with anything, you can ask for help on [our Discord server](https://discord.gg/uPveNfTuCJ), and we will help you with anything you need.

## Feedback

In all sincerity we can have, your feedback is very important to us, so if you have any feedback, you can contact us on [our Discord server](https://discord.gg/uPveNfTuCJ), and we *will* listen to your feedback.

## Contribute to the project

This project is only made by one person, so if you want to contribute, you can do it by making a pull request, and if you want to work on the project, you can contact me on Discord: @pedro.js

## License

PeforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.
