import coder from './coder.js'
import scene from './scene.js'
import menu from './menu.js'

coder.init('PerforVNM', 'com.perforvnm')

let firstScene = scene.init('scene1')
firstScene = scene.addCharacter(firstScene, 'venix', 'venix_looking', 'center')
firstScene = scene.addScenario(firstScene, 'scenario')
scene.finalize(firstScene)

let secondScene = scene.init('scene2')
secondScene = scene.addCharacter(secondScene, 'venix', 'venix_sad', 'center')
secondScene = scene.addScenario(secondScene, 'scenario')
scene.finalize(secondScene)

menu.make('menu')


coder.finalize()