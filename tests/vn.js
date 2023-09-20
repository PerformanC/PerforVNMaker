import perfor from '../index.js'

perfor.coder.init({
  name: 'PerforVNM',
  fullName: 'The PerforVNM',
  applicationId: 'com.perforvnm',
  version: '1.0.0',
  paths: {
    android: './android'
  },
  optimizations: {
    codeGenTimePositions: true
  }
})

let menu = perfor.menu.init({
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
})

/*
menu = perfor.menu.addCustomRectangle(menu, {
  color: 'FFFFFF',
  opacity: 0.8,
  height: 'match',
  width: 'match',
  position: {
    side: 'left',
    margins: {
      side: 10,
      top: 10
    }
  }
})
*/

perfor.menu.finalize(menu) /* Generates the menu */

let firstScene = perfor.scene.init({
  name: 'scene1',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
}) /* Initializes a scene */
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
firstScene = perfor.scene.addSubScenes(firstScene, [{ text: 'second', scene: 'scene2' }, { text: 'third', scene: 'scene3' }]) /* Adds the subscenes to the first scene */
perfor.scene.finalize(firstScene) /* Finishes up the scene */

let secondScene = perfor.subScene.init({
  name: 'scene2',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
})
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
secondScene = perfor.scene.setNextScene(secondScene, { scene: 'scene4' })
/*
secondScene = perfor.scene.addCustomRectangle(secondScene, {
  color: 'FFFFFF',
  opacity: 0.8,
  height: 'match',
  width: 'match',
  position: {
    side: 'left',
    margins: {
      side: 10,
      top: 10
    }
  }
})
*/

perfor.scene.finalize(secondScene)

let thirdScene = perfor.subScene.init({
  name: 'scene3',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
})
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
thirdScene = perfor.scene.addSpeech(thirdScene, {
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
    fontSize: 9,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
})
thirdScene = perfor.scene.setNextScene(thirdScene, { scene: 'scene4' })
perfor.scene.finalize(thirdScene)

let fourthScene = perfor.scene.init({
  name: 'scene4',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
})
fourthScene = perfor.scene.addCharacter(fourthScene, {
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
fourthScene = perfor.scene.addScenario(fourthScene, { image: 'background_thanking' })
fourthScene = perfor.scene.addSpeech(fourthScene, {
  author: {
    name: 'Pedro',
    textColor: 'FFFFFF',
    rectangle: {
      color: '000000',
      opacity: 0.6
    }
  },
  text: {
    content: '"Paths are incredible, don\'t you think?" says in a happy tone',
    color: 'FFFFFF',
    fontSize: 9,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
})
fourthScene = perfor.scene.setNextScene(fourthScene, { scene: 'scene5' })
perfor.scene.finalize(fourthScene)

let fifthScene = perfor.scene.init({
  name: 'scene5',
  textColor: 'FFFFFF',
  backTextColor: 'FFFFFF',
  buttonsColor: 'FFFFFF',
  footerTextColor: 'FFFFFF'
})
fifthScene = perfor.scene.addCharacter(fifthScene, {
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
fifthScene = perfor.scene.addScenario(fifthScene, { image: 'background_thanking' })
fifthScene = perfor.scene.addSpeech(fifthScene, {
  author: {
    name: 'Pedro',
    textColor: 'FFFFFF',
    rectangle: {
      color: '000000',
      opacity: 0.6
    }
  },
  text: {
    content: '"And our multi path feature.. amazing."',
    color: 'FFFFFF',
    fontSize: 9,
    rectangle: {
      color: '000000',
      opacity: 0.8
    }
  }
})
perfor.scene.finalize(fifthScene)

perfor.coder.finalize() /* Finishes up the code */
