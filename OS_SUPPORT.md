# Feature OS Support

This file is made to show the features supported by PerforVNM for each OS in a simple and easy way.

## [Android](https://www.android.com/)

Android System is the most used OS in the world, found in everything from drones to fridges, and it's the first OS that PerforVNM is being developed for.

### Coder options

The coder options are the options that the coder can use to customize the VN code.

#### Optimizations

The optimizations are the options that the coder can use to optimize the VN code, for speed, size and etc.

##### Version support

\>= `v1.22.0 & v1.20.0`: Supported without `preCalculateScenesInfo` & `hashAchievementIds`

\>= `v1.23.0 & v1.21.0`: Supported

### Scenes

The scenes are the place where the story happens.

#### Save button

The save button allows the player to save their progress in the visual novel.

##### Version support

\>= `v1.18.2-b.0 & v1.16.8-b.0`: Supported

#### Menu button

The menu button is the button that goes to the menu.

##### Version support

\>= `v1.2.2-alpha`: Supported

#### Characters

The characters are overlaid on the scenario, and they can be moved around the screen expressing emotions.

##### Version support

\>= `v1.0.2-alpha`: Supported but with bugs

\>= `v1.15.0-b.0 & v1.12.2-b.0`: Supported

OBS: Versions below `v1.5.3` must have the character image saved on the `drawable` folder, and versions above `v1.5.3` must have the character image saved on the `raw` folder.

##### Animations

The character animations are the animations that the characters can do, like `moving`, `jumping`, etc.

###### Version support

\>= `v1.15.0-b.0 & 1.12.2-b.0`: Supported but limited to `movement` animation and 1 animation per character only

\>= `v1.18.2-b.0 & v1.16.8-b.0`: Supported

#### Scenarios

The scenarios are the image in the background of the scene, and they can be changed to represent different places.

##### Version support

\>= `v1.0.2-alpha`: Supported but with bugs

\>= `v1.15.0-b.0 & v1.12.2-b.0`: Supported

OBS: Versions below `v1.5.3` must have the scenario image saved on the `drawable` folder, and versions above `v1.5.3` must have the scenario image saved on the `raw` folder.

#### Speech

The speech is the text that the characters say, and it adds more expression to the character and more context to the scene.

##### Version support

\>= `v1.1.2-alpha`: Supported but with bugs (speech texts containing `"`, `'` or `\` are not supported)

\>= `v1.16.2-b.0 & v1.14.6-b.0`: Supported without author animation:

\>= `v1.16.2-b.0 & v1.15.8-b.0`: Supported

#### Sound effect

The sound effect is the sound that can represent the sound of a door opening, a car passing by, etc. They are important for the immersion of the player into the game's story.

##### Warning

Ensure that two sound effect doesn't play at the same time, or it *may* generate audio bugs.

##### Version support

\>= `v1.5.3-alpha`: Supported but with bugs and limited to 1 sound effect per scene

\>= `v1.16.1-b.0 & v1.14.4-b.0`: Supported but limited to 1 sound effect per scene

\>= `v1.18.2-b.0 & v1.16.8-b.0`: Supported

#### Music

The music, differently from the sound effect, is the sound that can represent the mood of the scene, and it's also important for immersion.

##### Version support

\>= `v1.16.0-b.0 & v1.14.2-b.0`: Supported

##### Custom paths

Custom paths allow multiple ends to the visual novel, allowing the player to choose their own path through buttons.

###### Version support

\>= `v1.19.2-b.0 & v1.17.8-b.0`: Supported

##### Custom elements

Custom elements are elements that can be added to the scene, like a button, a text box, etc.

###### Version support

\>= `v1.20.2 & v1.18.8`: Supported

##### Achievements

Achievements are a way to reward the player for doing something in the game, like finishing the game, or finding a secret.

###### Version support

\>= `1.23.0 & v1.21.0`: Supported

##### Items

Items are a way to reward the player for doing something in the game, like finishing the game, or finding a secret. Allows also to unlock custom paths.

###### Version support

\>= `1.23.0 & v1.21.0`: Supported

### Menu

The menu is the place where the player can access the settings, the About menu, and start the VN.

#### Start button

The start button is the button that starts the VN.

##### Version support

\>= `v1.0.0-alpha`: Supported

\>= `v1.1.2-alpha`: Supported with design changes

#### About

The About menu is the place where the player can see the information about the VN, like the name, the version, etc.

##### Version support

\>= `v1.0.2-alpha`: Supported without hyperlink support & additional text support

\>= `v1.1.2-alpha`: Supported without additional text support

\>= `v1.16.2-b.0 & v1.15.8-b.0`: Supported

#### Settings

The settings menu is the place where the player can change the text speed, menu music volume, etc.

##### Version support

\>= `v1.5.3-beta`: Supported but with bugs (dimensions)

\>= `v1.16.2-b.0 & v1.14.8-b.0`: Supported

#### Saves

The saves menu is the place where the player can save and load their progress.

##### Version support

\>= `v1.18.2-b.0 & v1.16.8-b.0`: Supported but with bugs (saving)

\>= `v1.19.2-b.0 & v1.17.8-b.0`: Supported but with bugs with scene name hashing optimizations and bugs with sub-scenes on history.

\>= `v1.22.0 & v1.20.0`: Supported

#### Achievements

The achievements menu is the place where the player can see the achievements that they got.

##### Version support

\>= `1.23.0 & v1.21.0`: Supported

#### Background music

The background music is the music that plays on the menu.

##### Version support

\>= `v1.4.2-alpha`: Supported

#### Custom elements

Custom elements are elements that can be added to the menu, like a button, a text box, etc.

##### Version support

\>= `v1.20.2 & 1.18.8`: Supported

### Custom elements

Custom elements are elements that can be added to the VN, like a button, a text box, etc.

#### Version support

\>= ` v1.20.2 & v1.18.8`: Supported, uses either `perfor.menu` or `perfor.scene`

\>= `v1.23.0 & 1.21.0`: Supported, uses `perfor.custom`

## [iOS](https://www.apple.com/br/ios/ios-16/)

We're sorry, but we don't have support for iOS yet, and neither have plans to support it in the near future due to the difficulty to build in non-Apple devices. (The PerformanC team doesn't have any Apple devices, but if you're willing to voluntarily help us, please contact us on our [Discord](https://discord.gg/uPveNfTuCJ))

## [Windows](https://www.microsoft.com/windows/), [Linux distros](https://www.linux.org/pages/download/) & [MacOS](https://www.apple.com/macos)

We don't have support for them yet, but it's planned to be supported in the future after the completion of the Android code generation.

Spoiler (Not confirmed): We're planning to use C89 with the Vulkan API (or OpenGL/GTK) to make the VN maker. Important to note that they *WILL* share the same codebase.

## [Web](https://wikipedia.org/wiki/Web)

Sadly, we don't have support for the web yet, but it's planned to be supported in the future after the completion of the PC code generation.

Spoiler (Not confirmed): We're planning to use JS, HTML and CSS to make the VN maker.

## Features

This is the list of features that we're planning to add (or modify) to PerforVNM in the future.

- [x] Scenes (Completed)
- [x] Scenarios (Completed)
- [x] Speech (Completed)
- [x] Music (Completed)
- [x] Transitions (Completed)
- [x] Characters (Completed)
- [x] Animations (Completed)
- [x] Sound effects (Completed)
- [x] Save/Load system (Completed)
- [x] Custom paths (Completed)
- [x] Custom Views (Completed)
- [x] Achievements (Completed)
- [x] Items (Completed)
- [x] Menu (Missing vertical footer)
- [x] Settings (Misses some additional configurations)

## Code generation support

- [x] Kotlin (Android)
- [ ] Swift (iOS)
- [ ] C (Windows, Linux and MacOS)
- [ ] JS, HTML and CSS (Web)

<br/>

The PerformanC team thanks you for your attention, and we hope that you enjoy PerforVNM!
