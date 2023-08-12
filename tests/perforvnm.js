import perfor from '../index.js'

perfor.coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0',
  paths: {
    android: './android'
  }
})

perfor.menu.make({
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

let firstScene = perfor.scene.init({ name: 'scene1' }) /* Initializes a scene */
firstScene = perfor.scene.addCharacter(firstScene, {
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
      top: -10
    },
  }, {
    side: 'right',
    duration: 1000,
    margins: {
      side: 20,
      top: 0
    },
    type: 'movement',
    delay: 1000,
  }]
}) /* Adds a character to the scene */
firstScene = perfor.scene.addScenario(firstScene, { image: 'background_thanking' }) /* Adds a scenario to the scene */
firstScene = perfor.scene.addSoundEffects(firstScene, [{ sound: 'menu_music', delay: 0 }]) /* Adds a sound effect to the scene at second 1 */
firstScene = perfor.scene.addTransition(firstScene, { duration: 1000 }) /* Adds a transition to the scene */
perfor.scene.finalize(firstScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' }) /* Writes the scene */

let secondScene = perfor.scene.init({ name: 'scene2' })
secondScene = perfor.scene.addCharacter(secondScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margins: {
      side: 20,
      top: 0
    }
  }
})
secondScene = perfor.scene.addScenario(secondScene, { image: 'background_thanking' })
secondScene = perfor.scene.addSpeech(secondScene, {
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
    fontSize: 9,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
}) /* Adds a speech to the scene */
perfor.scene.finalize(secondScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

let thirdScene = perfor.scene.init({ name: 'scene3' })
thirdScene = perfor.scene.addCharacter(thirdScene, {
  name: 'Pedro',
  image: 'pedro_staring',
  position: {
    side: 'left',
    margins: {
      side: 20,
      top: 0
    }
  }
})
thirdScene = perfor.scene.addScenario(thirdScene, { image: 'background_thanking' })
// thirdScene = perfor.scene.addSpeech(thirdScene, {
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
perfor.scene.finalize(thirdScene, { buttonsColor: 'FFFFFF', footerTextColor: 'FFFFFF' })

perfor.coder.finalize() /* Finishes up the code */