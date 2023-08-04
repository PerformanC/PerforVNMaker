import fs from 'fs'

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

  return { name: options.name, characters: [], background: null, speech: null, effect: null, music: null, transition: null }
}

function addCharacter(scene, options) {
  if (!options?.name) {
    console.error(`ERROR: Character name not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (scene.characters.find(character => character.name == options.name)) {
    console.error(`ERROR: Character already exists.\n- Character name: ${options.name}\n- Scene name: ${scene.name}\n- Image: ${options.image}\n- Position: ${options.position}`)

    process.exit(1)
  }

  if (!options.image) {
    console.error(`ERROR: Character image not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.image))) {
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

  if (options.position.side != 'center' && options.position.margins?.side == null) {
    console.error(`ERROR: Character position side margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (options.position.side != 'center' && typeof options.position.margins?.side != 'number') {
    console.error(`ERROR: Character position margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (options.position.side != 'center' && options.position.margins?.top == null) {
    console.error(`ERROR: Character position top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (options.position.side != 'center' && typeof options.position.margins?.top != 'number') {
    console.error(`ERROR: Character position top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (options.animation) {
    if (!options.animation.side) {
      console.error(`ERROR: Character animation side not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (!['center', 'left', 'right'].includes(options.animation.side)) {
      console.error(`ERROR: Character animation side not valid, it must be either center, left or right.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (options.animation.side != 'center' && options.animation.margins?.side == null) {
      console.error(`ERROR: Character animation side margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (options.animation.side != 'center' && typeof options.animation.margins?.side != 'number') {
      console.error(`ERROR: Character animation side margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (options.animation.side != 'center' && options.animation.margins.top == null) {
      console.error(`ERROR: Character animation top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (options.animation.side != 'center' && typeof options.animation.margins?.top != 'number') {
      console.error(`ERROR: Character animation top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (options.animation.duration == null) {
      console.error(`ERROR: Character animation duratiton not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (typeof options.animation.duration != 'number') {
      console.error(`ERROR: Character animation duratiton must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }
  }

  console.log(`Adding character "${options.name}" for scene "${scene.name}".. (Android)`)

  scene.characters.push({ name: options.name, image: options.image, position: options.position, animation: options.animation })

  console.log(`Character "${options.name}" added for scene "${scene.name}". (Android)`)

  return scene
}

function addScenario(scene, options) {
  if (!options?.image) {
    console.error(`ERROR: Scenario image not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.image))) {
    console.error(`ERROR: Scenario image not found.\n- Scene name: ${scene.name}\n- Image: ${options.image}`)

    process.exit(1)
  }

  console.log(`Adding scenario for scene "${scene.name}".. (Android)`)

  scene.background = options.image

  console.log(`Scenario added for scene "${scene.name}". (Android)`)

  return scene
}

function addSpeech(scene, options) {
  if (options.author?.name && !options.author.textColor) {
    console.error(`ERROR: Speech author text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options?.author?.rectangle?.color) {
    console.error(`ERROR: Speech author rectangle color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options?.author?.rectangle?.opacity) {
    console.error(`ERROR: Speech author rectangle opacity not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (typeof options.author.rectangle.opacity != 'number') {
    console.error(`ERROR: Speech author rectangle opacity must be a number.\n- Scene name: ${scene.name}`)

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

  if (!options.text.fontSize) {
    console.error(`ERROR: Speech text font size not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.text.rectangle?.color) {
    console.error(`ERROR: Speech text rectangle color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.text.rectangle?.opacity) {
    console.error(`ERROR: Speech text rectangle opacity not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (typeof options.text.rectangle.opacity != 'number') {
    console.error(`ERROR: Speech text rectangle opacity must be a number.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Adding speech for scene "${scene.name}".. (Android)`)

  scene.speech = options
  scene.speech.text.content = JSON.stringify(options.text.content).slice(1, -1)

  console.log(`Speech added for scene "${scene.name}". (Android)`)

  return scene
}

function addSoundEffect(scene, options) {
  if (!options?.sound) {
    console.error(`ERROR: Sound effect sound not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.sound))) {
    console.error(`ERROR: Sound effect sound not found.\n- Scene name: ${scene.name}\n- Sound: ${options.sound}`)

    process.exit(1)
  }

  if (options?.delay == null) {
    console.error(`ERROR: Sound effect delay not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (typeof options.delay != 'number') {
    console.error(`ERROR: Sound effect delay must be a number.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Adding sound effect for scene "${scene.name}".. (Android)`)

  scene.effect = options
  
  console.log(`Sound effect added for scene "${scene.name}". (Android)`)

  return scene
}

function addMusic(scene, options) {
  if (!options?.music) {
    console.error(`ERROR: Scene music not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.music))) {
    console.error(`ERROR: Scene music not found.\n- Scene name: ${scene.name}\n- Music: ${options.music}`)

    process.exit(1)
  }

  if (options?.delay == null) {
    console.error(`ERROR: Scene music delay not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (options.delay && typeof options.delay != 'number') {
    console.error(`ERROR: Scene music delay must be a number.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Adding music for scene "${scene.name}".. (Android)`)

  scene.music = options

  console.log(`Music added for scene "${scene.name}". (Android)`)

  return scene
}

function addTransition(scene, options) {
  if (!options?.duration) {
    console.error(`ERROR: Scene transition duration not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (typeof options.duration != 'number') {
    console.error(`ERROR: Scene transition duration must be a number.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Adding transition for scene "${scene.name}".. (Android)`)

  scene.transition = options

  console.log(`Transition added for scene "${scene.name}". (Android)`)

  return scene
}

function finalize(scene, options) {
  if (!options?.buttonsColor) {
    console.error(`ERROR: Scene "back" text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  if (!options.footerTextColor) {
    console.error(`ERROR: Scene text color not provided.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  console.log(`Ending scene, coding scene "${scene.name}".. (Android)`)

  const functionParams = []

  if (visualNovel.scenes.length == 0 && scene.speech) functionParams.push('animate: Boolean')
  if (visualNovel.scenes.length != 0 && !visualNovel.scenes[visualNovel.scenes.length - 1].speech) functionParams.push('animate: Boolean')

  if (visualNovel.scenes.length != 0 && scene.speech?.author?.name && visualNovel.scenes[visualNovel.scenes.length - 1].speech && !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name) functionParams.push('animateAuthor: Boolean')

  let sceneCode = '  private fun ' + scene.name + '(' + functionParams.join(', ') + ') {' + '\n' +
                  '    val frameLayout = FrameLayout(this)' + '\n' +
                  '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n'

  if ((scene.characters.length != 0 || scene.background != '') && scene.transition) {
    sceneCode += '    val animationFadeIn = AlphaAnimation(0f, 1f)' + '\n' +
                 '    animationFadeIn.duration = ' + scene.transition.duration + '\n' +
                 '    animationFadeIn.interpolator = LinearInterpolator()' + '\n' +
                 '    animationFadeIn.fillAfter = true' + '\n\n'
  }

  if (scene.background != '') {
    sceneCode += '    val imageView_scenario = ImageView(this)' + '\n' +
                 '    imageView_scenario.setImageResource(R.raw.' + scene.background + ')' + '\n' +
                 '    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                 '    frameLayout.addView(imageView_scenario)' + '\n\n'

    if (scene.transition)
      sceneCode += '    imageView_scenario.startAnimation(animationFadeIn)' + '\n\n'
  }

  for (let character of scene.characters) {
    switch (character.position.side) {
      case 'center': {
        sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + character.name + '.setImageResource(R.raw.' + character.image + ')' + '\n' +
                     '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     (character.animation ? '    val layoutParams_' + character.name + ' = LayoutParams(' + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n' +

                     '    layoutParams_' + character.name + '.gravity = Gravity.CENTER' + '\n\n' +
                      
                     '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' : '') +

                     '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

        break
      }
      case 'left': {
        sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + character.name + '.setImageResource(R.raw.' + character.image + ')' + '\n' +
                     '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    val layoutParams_' + character.name + ' = LayoutParams(' + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n' +

                     '    layoutParams_' + character.name + '.gravity = Gravity.CENTER' + '\n' +
                     '    layoutParams_' + character.name + '.setMargins(' + character.position.margins.side + ', ' + character.position.margins.top + ', 0, 0)' + '\n\n' +

                     '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' +

                     '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

        break
      }
      case 'right': {
        sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                     '    imageView_' + character.name + '.setImageResource(R.raw.' + character.image + ')' + '\n' +
                     '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                     '    val layoutParams_' + character.name + ' = LayoutParams(' + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n' +

                     '    layoutParams_' + character.name + '.gravity = Gravity.CENTER' + '\n' +
                     '    layoutParams_' + character.name + '.setMargins(0, ' + character.position.margins.top + ', ' + character.position.margins.side + ', 0)' + '\n\n' +

                     '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' +

                     '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

        break
      }
    }

    if (scene.transition) {
      sceneCode += '\n' + '    imageView_' + character.name + '.startAnimation(animationFadeIn)' + '\n'

      if (character.animation) {
        sceneCode += '\n' + '    animationFadeIn.setAnimationListener(object : Animation.AnimationListener {' + '\n' +
                     '      override fun onAnimationStart(animation: Animation?) {}' + '\n\n' +
      
                     '      override fun onAnimationEnd(animation: Animation?) {' + '\n'

        switch (character.animation.side) {
          case 'center': {
            sceneCode += '        imageView_' + character.name + '.animate()' + '\n' +
                         '          .translationX(((frameLayout.width - imageView_' + character.name + '.width) / 2).toFloat())' + '\n' +
                         '          .translationY(((frameLayout.height - imageView_' + character.name + '.height) / 2).toFloat())' + '\n' +
                         '          .setDuration(' + character.animation.duration + ')' + '\n' +
                         '          .start()' + '\n'
    
            break
          }
          case 'left':
          case 'right': {
            sceneCode += '        imageView_' + character.name + '.animate()' + '\n' +
                         '          .translationX(' + character.animation.margins.side + 'f)' + '\n' +
                         '          .translationY(' + character.animation.margins.top + 'f)' + '\n' +
                         '          .setDuration(' + character.animation.duration + ')' + '\n' +
                         '          .start()' + '\n'
    
            break
          }
        }

        sceneCode += '      }' + '\n\n' +
      
                     '      override fun onAnimationRepeat(animation: Animation?) {}' + '\n' +
                     '    })' + '\n'
      }
    } else if (character.animation) {
      switch (character.animation.side) {
        case 'center': {
          sceneCode += '\n' + '    imageView_' + character.name + '.animate()' + '\n' +
                       '      .translationX(((frameLayout.width - imageView_' + character.name + '.width) / 2).toFloat())' + '\n' +
                       '      .translationY(((frameLayout.height - imageView_' + character.name + '.height) / 2).toFloat())' + '\n' +
                       '      .setDuration(' + character.animation.duration + ')' + '\n' +
                       '      .start()' + '\n'
  
          break
        }
        case 'left':
        case 'right': {
          sceneCode += '\n' + '    imageView_' + character.name + '.animate()' + '\n' +
                       '      .translationX(' + character.animation.margins.side + 'f)' + '\n' +
                       '      .translationY(' + character.animation.margins.top + 'f)' + '\n' +
                       '      .setDuration(' + character.animation.duration + ')' + '\n' +
                       '      .start()' + '\n'
  
          break
        }
      }
    }
  }

  if (scene.speech) {
    sceneCode += '\n' + '    val rectangleViewSpeech = RectangleView(this)' + '\n\n' +

                 '    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, 200)' + '\n' +
                 '    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                 '    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech' + '\n' +
                 (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech ? '    rectangleViewSpeech.setAlpha(' + scene.speech.text.rectangle.opacity + 'f)' + '\n' : '') +
                 '    rectangleViewSpeech.setColor(0xFF' + scene.speech.text.rectangle.color + '.toInt())' + '\n' +
                 (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech ? ('\n    if (animate) {' + '\n' +
                 '      val animationRectangleSpeech = AlphaAnimation(0f, ' + scene.speech.text.rectangle.opacity + 'f)' + '\n' +
                 '      animationRectangleSpeech.duration = 1000'  + '\n' +
                 '      animationRectangleSpeech.interpolator = LinearInterpolator()' + '\n' +
                 '      animationRectangleSpeech.fillAfter = true' + '\n\n' +
             
                 '      rectangleViewSpeech.startAnimation(animationRectangleSpeech)' + '\n' +
                 '    } else {' + '\n' +
                 '      rectangleViewSpeech.setAlpha(' + scene.speech.text.rectangle.opacity + 'f)' + '\n' +
                 '    }' + '\n\n') : '\n') +

                 '    frameLayout.addView(rectangleViewSpeech)' + '\n\n' +

                 '    val textViewSpeech = TextView(this)' + '\n' +
                 '    textViewSpeech.textSize = ' + scene.speech.text.fontSize + 'f' + '\n' +
                 '    textViewSpeech.setTextColor(0xFF' + scene.speech.text.color + '.toInt())' + '\n\n' +

                 '    val layoutParamsSpeech = LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +
                  
                 '    layoutParamsSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsSpeech.setMargins(0, 0, 0, 80)' + '\n\n' +

                 '    textViewSpeech.layoutParams = layoutParamsSpeech' + '\n\n' +

                 '    var speechText = "' + scene.speech.text.content + '"' + '\n' +

                 (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech ? ('\n    if (animate) {' + '\n' + 
                 '      var i = 0' + '\n\n' +

                 '      handler.postDelayed(object : Runnable {' + '\n' +
                 '        override fun run() {' + '\n' +
                 '          if (i < speechText.length) {' + '\n' +
                 '            textViewSpeech.text = speechText.substring(0, i + 1)' + '\n' +
                 '            i++' + '\n' +
                 '            handler.postDelayed(this, textSpeed)' + '\n' +
                 '          }' + '\n' +
                 '        }' + '\n' +
                 '      }, textSpeed)' + '\n' +
                 '    } else {' + '\n' +
                 '      textViewSpeech.text = speechText' + '\n' +
                 '    }' + '\n\n') : '    var i = 0' + '\n\n' +

                 '    handler.postDelayed(object : Runnable {' + '\n' +
                 '      override fun run() {' + '\n' +
                 '        if (i < speechText.length) {' + '\n' +
                 '          textViewSpeech.text = speechText.substring(0, i + 1)' + '\n' +
                 '          i++' + '\n' +
                 '          handler.postDelayed(this, textSpeed)' + '\n' +
                 '        }' + '\n' +
                 '      }' + '\n' +
                 '    }, textSpeed)' + '\n\n') +

                 '    frameLayout.addView(textViewSpeech)' + '\n\n' +

                 '    val rectangleViewAuthor = RectangleView(this)' + '\n\n' +

                 '    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)' + '\n' +
                 '    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsRectangleAuthor.setMargins(0, 0, 0, 200)' + '\n\n' +

                 '    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor' + '\n' +
                 (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech ? '    rectangleViewAuthor.setAlpha(' + scene.speech.author.rectangle.opacity + 'f)' + '\n' : '') +
                 '    rectangleViewAuthor.setColor(0xFF' + scene.speech.author.rectangle.color + '.toInt())' + '\n\n' +
                 (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech ? ('    if (animate) {' + '\n' +
                 '      val animationRectangleAuthor = AlphaAnimation(0f, ' + scene.speech.author.rectangle.opacity + 'f)' + '\n' +
                 '      animationRectangleAuthor.duration = 1000'  + '\n' +
                 '      animationRectangleAuthor.interpolator = LinearInterpolator()' + '\n' +
                 '      animationRectangleAuthor.fillAfter = true' + '\n\n' +
             
                 '      rectangleViewAuthor.startAnimation(animationRectangleAuthor)' + '\n' +
                 '    } else { ' + '\n' +
                 '      rectangleViewAuthor.setAlpha(' + scene.speech.author.rectangle.opacity + 'f)' + '\n' + 
                 '    }' + '\n\n') : '') +

                 '    frameLayout.addView(rectangleViewAuthor)' +

                 (scene.speech.author.name ? '\n\n' + '    val textViewAuthor = TextView(this)' + '\n' +
                 '    textViewAuthor.text = "' + scene.speech.author.name + '"' + '\n' +
                 '    textViewAuthor.textSize = 20f' + '\n' +
                 '    textViewAuthor.setTextColor(0xFF' + scene.speech.author.textColor + '.toInt())' + '\n\n' +

                 '    val layoutParamsAuthor = LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +

                 '    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                 '    layoutParamsAuthor.setMargins(400, 0, 0, 200)' + '\n\n' +

                 '    textViewAuthor.layoutParams = layoutParamsAuthor' + '\n\n' +

                 (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech || (visualNovel.scenes.length != 0 && scene.speech?.author?.name && visualNovel.scenes[visualNovel.scenes.length - 1].speech && !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name) ? ('    ' + (visualNovel.scenes.length != 0 && scene.speech?.author?.name && visualNovel.scenes[visualNovel.scenes.length - 1].speech && !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name ? 'if (animateAuthor) {' : 'if (animate) {') + '\n' + 
                 '      val animationAuthor = AlphaAnimation(0f, 1f)' + '\n' +
                 '      animationAuthor.duration = 1000'  + '\n' +
                 '      animationAuthor.interpolator = LinearInterpolator()' + '\n' +
                 '      animationAuthor.fillAfter = true' + '\n\n' +

                 '      textViewAuthor.startAnimation(animationAuthor)' + '\n' +
                 '    }' + '\n\n') : '') +

                 '    frameLayout.addView(textViewAuthor)' : '') + '\n'

    visualNovel.internalInfo.hasSpeech = true
  }

  if (scene.music && !scene.effect) {
    if (scene.music.delay == 0)
      sceneCode += '\n' + '    mediaPlayer = MediaPlayer.create(this, R.raw.' + scene.music.music + ')' + '\n\n' +

                   '    if (mediaPlayer != null) {' + '\n' +
                   '      mediaPlayer!!.start()' + '\n\n' +

                   '      mediaPlayer!!.setVolume(musicVolume, musicVolume)' + '\n' +

                   '      mediaPlayer!!.setOnCompletionListener {' + '\n' +
                   '        if (mediaPlayer != null) {' + '\n' +
                   '          mediaPlayer!!.stop()' + '\n' +
                   '          mediaPlayer!!.release()' + '\n' +
                   '          mediaPlayer = null' + '\n' +
                   '        }' + '\n' +
                   '      }' + '\n' +
                   '    }' + '\n'

    else sceneCode += '\n' + '    mediaPlayer = MediaPlayer.create(this, R.raw.' + scene.music.music + ')' + '\n\n' +

                      '    if (mediaPlayer != null) handler.postDelayed(object : Runnable {' + '\n' +
                      '      override fun run() {' + '\n' +
                      '        mediaPlayer!!.start()' + '\n\n' +

                      '        mediaPlayer!!.setVolume(musicVolume, musicVolume)' + '\n\n' +

                      '        mediaPlayer!!.setOnCompletionListener {' + '\n' +
                      '          mediaPlayer!!.stop()' + '\n' +
                      '          mediaPlayer!!.release()' + '\n' +
                      '          mediaPlayer = null' + '\n' +
                      '        }' + '\n' +
                      '      }' + '\n' +
                      '    }, ' + scene.music.delay + 'L)' + '\n'

    visualNovel.internalInfo.hasSceneMusic = true
  } else if (scene.music && scene.effect) {
    const codes = []

    if (scene.music.delay == 0)
      codes.push('    if (mediaPlayer!= null) {' + '\n\n' +
      
                 '      mediaPlayer!!.start()' + '\n\n' +

                 '      mediaPlayer!!.setVolume(musicVolume, musicVolume)' + '\n' +

                 '      mediaPlayer!!.setOnCompletionListener {' + '\n' +
                 '        if (mediaPlayer != null) {' + '\n' +
                 '          mediaPlayer!!.stop()' + '\n' +
                 '          mediaPlayer!!.release()' + '\n' +
                 '          mediaPlayer = null' + '\n' +
                 '        }' + '\n' +
                 '      }' + '\n' +
                 '    }')
    else codes.push('    if (mediaPlayer != null) handler.postDelayed(object : Runnable {' + '\n' +
                    '      override fun run() {' + '\n' +
                    '        mediaPlayer!!.start()' + '\n\n' +

                    '        mediaPlayer!!.setVolume(musicVolume, musicVolume)' + '\n\n' +

                    '        mediaPlayer!!.setOnCompletionListener {' + '\n' +
                    '          if (mediaPlayer != null) {' + '\n' +
                    '            mediaPlayer!!.stop()' + '\n' +
                    '            mediaPlayer!!.release()' + '\n' +
                    '            mediaPlayer = null' + '\n' +
                    '          }' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n' +
                    '    }, ' + scene.music.delay + 'L)')

    if (scene.effect.delay == 0)
      codes.push('    if (mediaPlayer2 != null) {' + '\n\n' +
                 '      mediaPlayer2!!.start()' + '\n\n' +

                 '      mediaPlayer2!!.setVolume(sEffectVolume, sEffectVolume)' + '\n' +

                 '      mediaPlayer2!!.setOnCompletionListener {' + '\n' +
                 '        if (mediaPlayer2 != null) {' + '\n' +
                 '          mediaPlayer2!!.stop()' + '\n' +
                 '          mediaPlayer2!!.release()' + '\n' +
                 '          mediaPlayer2 = null' + '\n' +
                 '        }' + '\n' +
                 '      }' + '\n' +
                 '    }')
    else codes.push('    if (mediaPlayer2 != null) handler.postDelayed(object : Runnable {' + '\n' +
                    '      override fun run() {' + '\n' +
                    '        mediaPlayer2!!.start()' + '\n\n' +

                    '        mediaPlayer2!!.setVolume(sEffectVolume, sEffectVolume)' + '\n\n' +

                    '        mediaPlayer2!!.setOnCompletionListener {' + '\n' +
                    '          if (mediaPlayer2 != null) {' + '\n' +
                    '            mediaPlayer2!!.stop()' + '\n' +
                    '            mediaPlayer2!!.release()' + '\n' +
                    '            mediaPlayer2 = null' + '\n' +
                    '          }' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n' +
                    '    }, ' + scene.effect.delay + 'L)')

    sceneCode += '\n' + '    mediaPlayer = MediaPlayer.create(this, R.raw.' + scene.music.music + ')' + '\n\n' +
                 '    mediaPlayer2 = MediaPlayer.create(this, R.raw.' + scene.effect.sound + ')' + '\n\n' +

                 codes.join('\n\n') + '\n'

    visualNovel.internalInfo.hasSceneMusic = true
    visualNovel.internalInfo.hasEffect = true
    visualNovel.internalInfo.needs2Players = true
  } else if (!scene.music && scene.effect) {
    if (scene.effect.delay == 0)
      sceneCode += '\n' + '    mediaPlayer = MediaPlayer.create(this, R.raw.' + scene.effect.sound + ')' + '\n\n' +

                   '    if (mediaPlayer != null) {' + '\n' +
                   '      mediaPlayer!!.start()' + '\n\n' +

                   '      mediaPlayer!!.setVolume(sEffectVolume, sEffectVolume)' + '\n\n' +

                   '      mediaPlayer!!.setOnCompletionListener {' + '\n' +
                   '        if (mediaPlayer != null) {' + '\n' +
                   '          mediaPlayer!!.stop()' + '\n' +
                   '          mediaPlayer!!.release()' + '\n' +
                   '          mediaPlayer = null' + '\n' +
                   '        }' + '\n' +
                   '      }' + '\n' +
                   '    }' + '\n'

    else sceneCode += '\n' + '    mediaPlayer = MediaPlayer.create(this, R.raw.' + scene.effect.sound + ')' + '\n\n' +

                      '    if (mediaPlayer != null) handler.postDelayed(object : Runnable {' + '\n' +
                      '      override fun run() {' + '\n' +
                      '        mediaPlayer!!.start()' + '\n\n' +

                      '        mediaPlayer!!.setVolume(sEffectVolume, sEffectVolume)' + '\n\n' +

                      '        mediaPlayer!!.setOnCompletionListener {' + '\n' +
                      '          if (mediaPlayer != null) {' + '\n' +
                      '            mediaPlayer!!.stop()' + '\n' +
                      '            mediaPlayer!!.release()' + '\n' +
                      '            mediaPlayer = null' + '\n' +
                      '          }' + '\n' +
                      '        }' + '\n' +
                      '      }' + '\n' +
                      '    }, ' + scene.effect.delay + 'L)' + '\n'

    visualNovel.internalInfo.hasEffect = true
  }

  const finishScene = []

  if ((scene.effect && !scene.music) || (scene.effect && scene.music)) {
    finishScene.push('      if (mediaPlayer != null) {' + '\n' +
                     '        mediaPlayer!!.stop()' + '\n' +
                     '        mediaPlayer!!.release()' + '\n' +
                     '        mediaPlayer = null' + '\n' +
                     '      }')
  }

  if (scene.effect && scene.music) {
    finishScene.push('      if (mediaPlayer != null) {' + '\n' +
                     '        mediaPlayer!!.stop()' + '\n' +
                     '        mediaPlayer!!.release()' + '\n' +
                     '        mediaPlayer = null' + '\n' +
                     '      }')

    finishScene.push('      if (mediaPlayer2 != null) {' + '\n' +
                     '        mediaPlayer2!!.stop()' + '\n' +
                     '        mediaPlayer2!!.release()' + '\n' +
                     '        mediaPlayer2 = null' + '\n' +
                     '      }')
  }

  if (scene.speech || (scene.effect && scene.effect.delay != 0) || (scene.music && scene.music.delay != 0))
    finishScene.push('      handler.removeCallbacksAndMessages(null)')

  finishScene.push('      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)')

  sceneCode += '\n' + '    val buttonMenu = Button(this)' + '\n' +
               '    buttonMenu.text = "Menu"' + '\n' +
               '    buttonMenu.textSize = 10f' + '\n' +
               '    buttonMenu.setTextColor(0xFF' + options.buttonsColor + '.toInt())' + '\n' +
               '    buttonMenu.background = null' + '\n\n' +

               '    val layoutParamsMenu = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsMenu.setMargins(50, 0, 0, 0)' + '\n\n' +

               '    buttonMenu.layoutParams = layoutParamsMenu' + '\n\n' +

               (finishScene.length != 0 ? '    buttonMenu.setOnClickListener {' + '\n' + finishScene.join('\n\n') + '\n' + '__PERFORVNM_START_MUSIC__' + '\n\n'  : '    buttonMenu.setOnClickListener {__PERFORVNM_START_MUSIC__' + '\n\n') +

               '      ' + (visualNovel.menu ? visualNovel.menu.name : '__PERFORVNM_MENU__') + '\n' +
               '    }' + '\n\n' +

               '    frameLayout.addView(buttonMenu)' + '\n\n' +

               (visualNovel.scenes.length != 0 ? '    val buttonBack = Button(this)' + '\n' +
               '    buttonBack.text = "Back"' + '\n' +
               '    buttonBack.textSize = 10f' + '\n' +
               '    buttonBack.setTextColor(0xFF' + options.buttonsColor + '.toInt())' + '\n' + 
               '    buttonBack.background = null' + '\n\n' +

               '    val layoutParamsBack = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsBack.setMargins(50, 80, 0, 0)' + '\n\n' +

               '    buttonBack.layoutParams = layoutParamsBack' + '\n\n' +

               (finishScene.length != 0 ? '    buttonBack.setOnClickListener {' + '\n' + finishScene.join('\n\n') + '\n\n'  : '    buttonBack.setOnClickListener {' + '\n' ) +

               '      ' + visualNovel.scenes[visualNovel.scenes.length - 1].name + '(' + (visualNovel.scenes[visualNovel.scenes.length - 1].speech ? 'false' : '' ) + ')' + '\n' +
               '    }' + '\n\n' +

               '    frameLayout.addView(buttonBack)' + '\n\n' : '') +
  
               '    setContentView(frameLayout)__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__' + '\n' +
               '  }'

  visualNovel.scenes.push({ ...scene, code: sceneCode })

  console.log(`Scene "${scene.name}" coded. (Android)`)
}

export default {
  init,
  addCharacter,
  addScenario,
  addSpeech,
  addSoundEffect,
  addMusic,
  addTransition,
  finalize
}