import coder from './coder.js'
import scene from './scene.js'
import menu from './menu.js'

coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0'
})

let firstScene = scene.init({ name: 'scene1' })
firstScene = scene.addCharacter(firstScene, { name: 'venix', path: 'venix_looking', position: 'center' })
firstScene = scene.addScenario(firstScene, { path: 'scenario' })
scene.finalize(firstScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

let secondScene = scene.init({ name: 'scene2' })
secondScene = scene.addCharacter(secondScene, { name: 'venix', path: 'venix_sad', position: 'center' })
secondScene = scene.addScenario(secondScene, { path: 'scenario' })
scene.finalize(secondScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

menu.make({
  backgroundImage: 'menu',
  footer: {
    color: '808080',
    textColor: 'FFFFFF'
  },
  backTextColor: 'FFFFFF'
})

coder.finalize()