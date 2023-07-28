import coder from './coder.js'
import scene from './scene.js'
import menu from './menu.js'

coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0'
})

let firstScene = scene.init({ name: 'scene1' }) /* Initializes a scene */
firstScene = scene.addCharacter(firstScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'center'
  }
}) /* Adds a character to the scene */
firstScene = scene.addScenario(firstScene, { image: 'background_thanking' }) /* Adds a scenario to the scene */
scene.finalize(firstScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' }) /* Writes the scene */

let secondScene = scene.init({ name: 'scene2' })
secondScene = scene.addCharacter(secondScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margin: 200
  }
})
secondScene = scene.addScenario(secondScene, { image: 'background_thanking' })
secondScene = scene.addSpeech(secondScene, {
  author: {
    name: 'Pedro',
    textColor: 'FFFFFF',
    rectangleColor: '5A5A5A'
  },
  text: {
    content: 'Welcome, user. Thanks for testing our code generator, this is an *basic*\n example of usage of the PerforVNM.',
    color: 'FFFFFF',
    rectangleColor: '808080'
  }
}) /* Adds a speech to the scene */
scene.finalize(secondScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

menu.make({
  backgroundImage: 'menu',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  footer: {
    color: '808080',
    textColor: 'FFFFFFF'
  }
}) /* Generates the menu */

coder.finalize() /* Finishes up the code */