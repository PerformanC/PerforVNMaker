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
  console.log('Ending scene, coding scene ' + scene.name + '.. (Android)')

  if (visualNovel.scenes.length != 0) {
    const lastScene = visualNovel.scenes[visualNovel.scenes.length - 1]

    const code = '\n\n' + '    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {' + '\n' +
                 '      ' + scene.name + '()' + '\n' +
                 '    }'

    visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENE_' + lastScene.name.toUpperCase() + '__', code)
  }

  let sceneCode = '  private fun ' + scene.name + '() {' + '\n' +
                  '    val frameLayout = FrameLayout(this)' + '\n' +
                  '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n'

  if (scene.characters.length == 0 && scene.background != '') {
    // Only background

    sceneCode += '    val imageView_scenario = ImageView(this)' + '\n\n' +

                 '    imageView_scenario.setImageResource(R.drawable.' + scene.background + ')' + '\n' +
                 '    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                 '    frameLayout.addView(imageView_scenario)' + '\n'
  } else if (scene.characters.length == 1 && scene.background == '') {
    // Only one character

    switch (scene.characters[0].position) {
      case 'center': {
        sceneCode += '    val imageView_' + scene.characters[0].name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.setImageResource(R.drawable.' + scene.characters[0].path + ')' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    frameLayout.addView(imageView_' + scene.characters[0].name + ')' + '\n'

        break
      }
    }
  } else {
    if (scene.background != '') {
      sceneCode += '    val imageView_scenario = ImageView(this)' + '\n' +
                   '    imageView_scenario.setImageResource(R.drawable.' + scene.background + ')' + '\n' +
                   '    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   '    frameLayout.addView(imageView_scenario)' + '\n\n'
    }

    for (let character of scene.characters) {
      switch (character.position) {
        case 'center': {
          sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                       '    imageView_' + character.name + '.setImageResource(R.drawable.' + character.path + ')' + '\n' +
                       '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                       '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

          break
        }
      }
    }
  }

  if (visualNovel.scenes.length != 0) {
    sceneCode += '\n' + '    val button = Button(this)' + '\n' +
    '    button.text = "Back"' + '\n' +
    '    button.textSize = 10f' + '\n' +
    '    button.setTextColor(Color.WHITE)' + '\n' + 
    '    button.background = null' + '\n\n' +

    '    val layoutParams = FrameLayout.LayoutParams(' + '\n' +
    '      LayoutParams.WRAP_CONTENT,' + '\n' +
    '      LayoutParams.WRAP_CONTENT' + '\n' +
    '    )' + '\n\n' +

    '    layoutParams.gravity = android.view.Gravity.TOP or android.view.Gravity.START' + '\n' +
    '    layoutParams.setMargins(50, 0, 0, 50)' + '\n\n' +

    '    button.layoutParams = layoutParams' + '\n\n' +

    '    button.setOnClickListener {' + '\n' +
    '      ' + visualNovel.scenes[visualNovel.scenes.length - 1].name + '()' + '\n' +
    '    }' + '\n\n' +

    '    frameLayout.addView(button)' + '\n\n' +

    '    setContentView(frameLayout)__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__'
  } else {
    sceneCode += '\n' + '    setContentView(frameLayout)__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__'
  }

  sceneCode += '\n' + '  }'

  helper.writeScene(sceneCode)

  visualNovel.scenes.push(scene)

  console.log('Scene ' + scene.name + ' coded. (Android)')
}

export default {
  init,
  addCharacter,
  addScenario,
  finalize
}