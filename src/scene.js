import fs from 'fs'

import helper from './helper.js'

function init(options) {
  if (options?.name == 'onCreate') {
    console.error('ERROR: Scene name cannot be onCreate. (Android)')

    process.exit(1)
  }

  if (options.name == 'menu') {
    console.error('ERROR: Scene name cannot be menu.')

    process.exit(1)
  }

  if (options.name == 'about') {
    console.error('ERROR: Scene name cannot be onBackPressed.')

    process.exit(1)
  }

  if (visualNovel.scenes.find(scene => scene.name == options.name)) {
    console.error('ERROR: Scene with duplicated name.\n- Scene name: ' + options.name)

    process.exit(1)
  }

  console.log('Starting scene.. (Android)')

  return { type: 'scene', speech: null, name: options.name, characters: [], background: null }
}

function addCharacter(scene, options) {
  if (!options?.name) {
    console.error(`ERROR: Character name not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.image) {
    console.error(`ERROR: Character image not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!fs.readdirSync(`../android/app/src/main/res/drawable`).find((file) => file.startsWith(options.image))) {
    console.error(`ERROR: Character image not found.\n- Character name: ${options.name}\n- Scene name: ${scene.name}\n- Image: ${options.image}`)

    process.exit(1)
  }

  if (!options.position?.side) {
    console.error(`ERROR: Character position side not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!['center', 'left', 'right'].includes(options.position.side)) {
    console.error(`ERROR: Character position side not valid, it must be either center, left or right.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (options.position.side != 'center' && !options.position.margin) {
    console.error(`ERROR: Character position margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (scene.characters.find(character => character.name == options.name)) {
    console.error(`ERROR: Character already exists.\n- Character name: ${options.name}\n- Scene name: ${scene.name}\n- Image: ${options.image}\n- Position: ${options.position}`)

    process.exit(1)
  }

  console.log(`Adding character "${options.name}" for scene "${scene.name}".. (Android)`)

  scene.characters.push({ name: options.name, image: options.image, position: options.position })

  console.log(`Character "${options.name}" added for scene "${scene.name}". (Android)`)

  return scene
}

function addScenario(scene, options) {
  if (!options?.image) {
    console.error(`ERROR: Scenario image not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!fs.readdirSync(`../android/app/src/main/res/drawable`).find((file) => file.startsWith(options.image))) {
    console.error(`ERROR: Scenario image not found.\n- Scene name: ${scene.name}\n- Image: ${options.image}`)

    process.exit(1)
  }

  console.log(`Adding scenario for scene "${scene.name}".. (Android)`)

  scene.background = options.image

  console.log(`Scenario added for scene "${scene.name}". (Android)`)

  return scene
}

function addSpeech(scene, options) {
  if (!options?.author?.name) {
    console.error(`ERROR: Speech author name not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.author.textColor) {
    console.error(`ERROR: Speech author text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options?.author?.rectangleColor) {
    console.error(`ERROR: Speech author rectangle color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.text?.content) {
    console.error(`ERROR: Speech text content not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.text.color) {
    console.error(`ERROR: Speech text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.text.rectangleColor) {
    console.error(`ERROR: Speech text rectangle color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Adding speech for scene "${scene.name}".. (Android)`)

  scene.speech = { author: { name: options.author.name, textColor: options.author.textColor, rectangleColor: options.author.rectangleColor }, text: { content: options.text.content.replace(/\n/g, '\\n'), color: options.text.color, rectangleColor: options.text.rectangleColor } }

  console.log(`Speech added for scene "${scene.name}". (Android)`)

  return scene
}

function finalize(scene, options) {
  if (!options?.backTextColor) {
    console.error(`ERROR: Scene "back" text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.footerTextColor) {
    console.error(`ERROR: Scene text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Ending scene, coding scene "${scene.name}".. (Android)`)

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
    sceneCode += '    val imageView_scenario = ImageView(this)' + '\n\n' +

                 '    imageView_scenario.setImageResource(R.drawable.' + scene.background + ')' + '\n' +
                 '    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                 '    frameLayout.addView(imageView_scenario)' + '\n'
  } else if (scene.characters.length == 1 && scene.background == '') {
    switch (scene.characters[0].position.side) {
      case 'center': {
        sceneCode += '    val imageView_' + scene.characters[0].name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.setImageResource(R.drawable.' + scene.characters[0].image + ')' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    frameLayout.addView(imageView_' + scene.characters[0].name + ')' + '\n'

        break
      }
      case 'left': {
        sceneCode += '    val imageView_' + scene.characters[0].name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.setImageResource(R.drawable.' + scene.characters[0].image + ')' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    val layoutParams_' + scene.characters[0].name + ' = FrameLayout.LayoutParams(' + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n' +

                     '    layoutParams_' + scene.characters[0].name + '.gravity = Gravity.START or Gravity.CENTER_VERTICAL' + '\n' +
                     '    layoutParams_' + scene.characters[0].name + '.setMargins(' + scene.characters[0].position.margin + ', 0, 0, 0)' + '\n\n' +

                     '    imageView_' + scene.characters[0].name + '.layoutParams = layoutParams_' + scene.characters[0].name + '\n\n' +

                     '    frameLayout.addView(imageView_' + scene.characters[0].name + ')' + '\n'

        break
      }
      case 'right': {
        sceneCode += '    val imageView_' + scene.characters[0].name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.setImageResource(R.drawable.' + scene.characters[0].image + ')' + '\n' +
                     '    imageView_' + scene.characters[0].name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    val layoutParams_' + scene.characters[0].name + ' = FrameLayout.LayoutParams(' + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n' +

                     '    layoutParams_' + scene.characters[0].name + '.gravity = Gravity.END or Gravity.CENTER_VERTICAL' + '\n' +
                     '    layoutParams_' + scene.characters[0].name + '.setMargins(0, 0, ' + scene.characters[0].position.margin + ', 0)' + '\n\n' +
                      
                     '    imageView_' + scene.characters[0].name + '.layoutParams = layoutParams_' + scene.characters[0].name + '\n\n' +

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
      switch (character.position.side) {
        case 'center': {
          sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                       '    imageView_' + character.name + '.setImageResource(R.drawable.' + character.image + ')' + '\n' +
                       '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                       '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

          break
        }
        case 'left': {
          sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                       '    imageView_' + character.name + '.setImageResource(R.drawable.' + character.image + ')' + '\n' +
                       '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                       '    val layoutParams_' + character.name + ' = FrameLayout.LayoutParams(' + '\n' +
                       '      LayoutParams.WRAP_CONTENT,' + '\n' +
                       '      LayoutParams.WRAP_CONTENT' + '\n' +
                       '    )' + '\n\n' +

                       '    layoutParams_' + character.name + '.gravity = Gravity.START or Gravity.CENTER_VERTICAL' + '\n' +
                       '    layoutParams_' + character.name + '.setMargins(' + character.position.margin + ', 0, 0, 0)' + '\n\n' +

                       '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' +

                       '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

          break
        }
        case 'right': {
          sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                       '    imageView_' + character.name + '.setImageResource(R.drawable.' + character.image + ')' + '\n' +
                       '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                       '    val layoutParams_' + character.name + ' = FrameLayout.LayoutParams(' + '\n' +
                       '      LayoutParams.WRAP_CONTENT,' + '\n' +
                       '      LayoutParams.WRAP_CONTENT' + '\n' +
                       '    )' + '\n\n' +

                       '    layoutParams_' + character.name + '.gravity = Gravity.END or Gravity.CENTER_VERTICAL' + '\n' +
                       '    layoutParams_' + character.name + '.setMargins(0, 0, ' + character.position.margin + ', 0)' + '\n\n' +

                       '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' +

                       '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

          break
        }
      }
    }
  }

  if (scene.speech) {
    sceneCode += '\n' + '    val rectangleViewSpeech = RectangleView(this)' + '\n\n' +

                 '    val layoutParamsRectangleSpeech = FrameLayout.LayoutParams(1920, 200)' + '\n' +
                 '    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                 '    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech' + '\n' +
                 '    rectangleViewSpeech.setAlpha(0.8f)' + '\n' +
                  '    rectangleViewSpeech.setColor(0xFF' + scene.speech.text.rectangleColor + '.toInt())' + '\n\n' +

                 '    frameLayout.addView(rectangleViewSpeech)' + '\n\n' +

                 '    val textViewSpeech = TextView(this)' + '\n' +
                 '    textViewSpeech.text = "' + scene.speech.text.content + '"' + '\n' +
                 '    textViewSpeech.textSize = 13f' + '\n' +
                 '    textViewSpeech.setTextColor(0xFF' + scene.speech.text.color + '.toInt())' + '\n\n' +

                 '    val layoutParamsSpeech = FrameLayout.LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +
                  
                 '    layoutParamsSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsSpeech.setMargins(0, 0, 0, 80)' + '\n\n' +

                 '    textViewSpeech.layoutParams = layoutParamsSpeech' + '\n\n' +

                 '    frameLayout.addView(textViewSpeech)' + '\n\n' +

                 '    val rectangleViewAuthor = RectangleView(this)' + '\n\n' +

                 '    val layoutParamsRectangleAuthor = FrameLayout.LayoutParams(1920, 70)' + '\n' +
                 '    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsRectangleAuthor.setMargins(0, 0, 0, 200)' + '\n\n' +

                 '    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor' + '\n' +
                 '    rectangleViewAuthor.setAlpha(0.8f)' + '\n' +
                 '    rectangleViewAuthor.setColor(0xFF' + scene.speech.author.rectangleColor + '.toInt())' + '\n\n' +

                 '    frameLayout.addView(rectangleViewAuthor)' + '\n\n' +

                 '    val textViewAuthor = TextView(this)' + '\n' +
                 '    textViewAuthor.text = "' + scene.speech.author.name + '"' + '\n' +
                 '    textViewAuthor.textSize = 20f' + '\n' +
                 '    textViewAuthor.setTextColor(0xFF' + scene.speech.author.textColor + '.toInt())' + '\n\n' +

                 '    val layoutParamsAuthor = FrameLayout.LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +

                 '    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                 '    layoutParamsAuthor.setMargins(400, 0, 0, 200)' + '\n\n' +

                 '    textViewAuthor.layoutParams = layoutParamsAuthor' + '\n\n' +

                 '    frameLayout.addView(textViewAuthor)' + '\n'
  }

  if (visualNovel.scenes.length != 0) {
    sceneCode += '\n' + '    val button = Button(this)' + '\n' +
    '    button.text = "Back"' + '\n' +
    '    button.textSize = 10f' + '\n' +
    '    button.setTextColor(0xFF' + options.backTextColor + '.toInt())' + '\n' + 
    '    button.background = null' + '\n\n' +

    '    val layoutParamsBack = FrameLayout.LayoutParams(' + '\n' +
    '      LayoutParams.WRAP_CONTENT,' + '\n' +
    '      LayoutParams.WRAP_CONTENT' + '\n' +
    '    )' + '\n\n' +

    '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
    '    layoutParamsBack.setMargins(50, 0, 0, 50)' + '\n\n' +

    '    button.layoutParams = layoutParamsBack' + '\n\n' +

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

  console.log(`Scene "${scene.name}" coded. (Android)`)
}

export default {
  init,
  addCharacter,
  addScenario,
  addSpeech,
  finalize
}