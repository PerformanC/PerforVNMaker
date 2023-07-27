import helper from './helper.js'

function init(name) {
  console.log('Starting scene, writing scene page.. (Android)')

  console.log('Scene was coded. (Android)')

  return { type: 'scene', name: name, characters: [], background: '' }
}

function addCharacter(scene, characterName, path, position) {
  console.log('Starting character, writing character page.. (Android)')

  scene.characters.push({ name: characterName, path, position })

  console.log('Character was coded. (Android)')

  return scene
}

function addScenario(scene, path) {
  console.log('Starting scenario, writing scenario page.. (Android)')

  scene.background = path

  console.log('Scenario was coded. (Android)')

  return scene
}

function finalize(scene) {
  console.log('Ending scene, coding scene ' + scene.name + '  page.. (Android)')

  visualNovel.scenes.push(scene)

  let sceneCode = '  public fun ' + scene.name + '() {' + '\n' +
                  '  '

  if (scene.characters.length == 0 && scene.background != '') {
    // Only background

    sceneCode += '    val imageView_' + scene.name + ' = ImageView(this)' + '\n\n' +

                 '    imageView_' + scene.name + '.setImageResource(R.drawable.' + scene.background + ')' + '\n' +
                 '    imageView_' + scene.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                 '    setContentView(imageView_' + scene.name + ')'
  } else if (scene.characters.length == 1 && scene.background == '') {
    // Only one character

    switch (scene.characters[0].position) {
      case 'center': {
        sceneCode += '    val imageView_' + scene.name + '_' + scene.characters[0].name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + scene.name + '_' + scene.characters[0].name + '.setImageResource(R.drawable.' + scene.characters[0].path + ')' + '\n' +
                     '    imageView_' + scene.name + '_' + scene.characters[0].name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    setContentView(imageView_' + scene.name + '_' + scene.characters[0].name + ')'

        break
      }
    }
  } else {
    sceneCode += '  val frameLayout_' + scene.name + ' = FrameLayout(this)' + '\n\n' //+ 'frameLayout_' + scene.name + '.addView(imageView_' + scene.name + ')' + '\n\n'

    if (scene.background != '') {
      sceneCode += '    val imageView_' + scene.name + ' = ImageView(this)' + '\n' +
                   '    imageView_' + scene.name + '.setImageResource(R.drawable.' + scene.background + ')' + '\n' +
                   '    imageView_' + scene.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   '    frameLayout_' + scene.name + '.addView(imageView_' + scene.name + ')' + '\n\n'
    }

    for (let character of scene.characters) {
      switch (character.position) {
        case 'center': {
          sceneCode += '    val imageView_' + scene.name + '_' + character.name + ' = ImageView(this)' + '\n' +
                       '    imageView_' + scene.name + '_' + character.name + '.setImageResource(R.drawable.' + character.path + ')' + '\n' +
                       '    imageView_' + scene.name + '_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                       '    frameLayout_' + scene.name + '.addView(imageView_' + scene.name + '_' + character.name + ')' + '\n'

          break
        }
      }
    }

    sceneCode += '\n' + '    setContentView(frameLayout_' + scene.name + ')'
  }

  sceneCode += '\n' + '  }'

  helper.writeScene(sceneCode)

  console.log('Scene ' + scene.name + ' coded. (Android)')
}

export default {
  init,
  addCharacter,
  addScenario,
  finalize
}