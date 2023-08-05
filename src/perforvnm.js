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
  textSpeed: 50,
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  aboutText: 'This is our example visual novel, made by @ThePedroo',
  seekBar: {
    backgroundColor: 'F00000',
    progressColor: 'FFFFFF',
    thumbColor: '22FF00'
  },
  background: {
    image: 'menu',
    music: 'menu_music' // https://www.youtube.com/watch?v=DEhBqcbDHh4
  },
  footer: {
    color: '000000',
    textColor: 'FFFFFFF',
    opacity: 0.8
  }
}) /* Generates the menu */

let firstScene = scene.init({ name: 'scene1' }) /* Initializes a scene */
firstScene = scene.addCharacter(firstScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'center'
  },
  animations: [{
    type: 'jump',
    delay: 0,
    duration: 1000,
    margins: {
      top: -100
    },
  }, {
    side: 'right',
    duration: 1000,
    margins: {
      side: 200,
      top: 0
    },
    type: 'movement',
    delay: 1000,
  }]
}) /* Adds a character to the scene */
firstScene = scene.addScenario(firstScene, { image: 'background_thanking' }) /* Adds a scenario to the scene */
firstScene = scene.addSoundEffect(firstScene, { sound: 'menu_music', delay: 1000 }) /* Adds a sound effect to the scene at second 1 */
firstScene = scene.addTransition(firstScene, { duration: 1000 }) /* Adds a transition to the scene */
scene.finalize(firstScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' }) /* Writes the scene */

let secondScene = scene.init({ name: 'scene2' })
secondScene = scene.addCharacter(secondScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margins: {
      side: 200,
      top: 0
    }
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
scene.finalize(secondScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

let thirdScene = scene.init({ name: 'scene3' })
thirdScene = scene.addCharacter(thirdScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margins: {
      side: 200,
      top: 0
    }
  }
})
thirdScene = scene.addScenario(thirdScene, { image: 'background_thanking' })
// thirdScene = scene.addSpeech(thirdScene, {
//   author: {
//     name: 'Pedro',
//     textColor: 'FFFFFF',
//     rectangle: {
//       color: '000000',
//       opacity: 0.6
//     }
//   },
//   text: {
//     content: '"And this is the third scene, incredible right? With this code generator\n you can make your own visual novels in a simple way."',
//     color: 'FFFFFF',
//     fontSize: 12,
//     rectangle: {
//       color: '000000',
//       opacity: 0.8
//     }
//   }
// })
scene.finalize(thirdScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

coder.finalize() /* Finishes up the code */