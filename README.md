# PerforVNMaker - WIP

## Description

PerforVNMaker (or PerforVNM) is a visual novel "engine" written in NodeJS. It transpiles your code into Kotlin code, making a fully native Android app.

## WIP

This project is still a WIP and highly unstable, it misses transpiling to IOS, Windows and Linux, and it's not even close to being finished.

## Usage

There are examples of the usage in Transpiler/perfornvm.js, but here's a quick example:

```js
import coder from './coder.js'
import scene from './scene.js'
import menu from './menu.js'

coder.init('PerforVNM', 'com.perforvnm')

let firstScene = scene.init('scene1')
firstScene = scene.addCharacter(firstScene, 'venix', 'venix_looking', 'center')
firstScene = scene.addScenario(firstScene, 'scenario')
scene.finalize(firstScene)

menu.make('menu')

coder.finalize()
```

## Contribute to the project

This project is only made by one person, so if you want to contribute, you can do it by making a pull request, and if you want to work on the project, you can contact me on Discord: @pedro.js

## License

PeforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.
