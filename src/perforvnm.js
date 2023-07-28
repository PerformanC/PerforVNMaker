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
  backgroundImage: 'menu',
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
scene.finalize(secondScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

let thirdScene = scene.init({ name: 'scene3' })
thirdScene = scene.addCharacter(thirdScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margin: 200
  }
})
thirdScene = scene.addScenario(thirdScene, { image: 'background_thanking' })
thirdScene = scene.addSpeech(thirdScene, {
  author: {
    name: 'Pedro',
    textColor: 'FFFFFF',
    rectangle: {
      color: '000000',
      opacity: 0.6
    }
  },
  text: {
    content: '"And this is the third scene, incredible right? With this code generator\n you can make your own visual novels in a simple way."',
    color: 'FFFFFF',
    fontSize: 12,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
})
scene.finalize(thirdScene, { backTextColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

coder.finalize() /* Finishes up the code */