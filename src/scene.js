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

  if (options.animations) {
    if (!Array.isArray(options.animations)) {
      console.error(`ERROR: Character animations must be an array.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    for (let animation of options.animations) {
      if (!animation.type) {
        console.error(`ERROR: Character animation type not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

        process.exit(1)
      }

      if (!['movement', 'jump', 'fadeIn', 'fadeOut', 'rotate', 'scale'].includes(animation.type)) {
        console.error(`ERROR: Character animation type not valid, it must be either movement, jump, fade, rotate or scale.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

        process.exit(1)
      }

      switch (animation.type) {
        case 'movement': {
          if (!animation.side) {
            console.error(`ERROR: Character animation movement side not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (!['center', 'left', 'right'].includes(animation.side)) {
            console.error(`ERROR: Character animation movement side not valid, it must be either center, left or right.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (animation.side != 'center' && animation.margins?.side == null) {
            console.error(`ERROR: Character animation movement side margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (animation.side != 'center' && typeof animation.margins?.side != 'number') {
            console.error(`ERROR: Character animation movement side margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (animation.side != 'center' && animation.margins.top == null) {
            console.error(`ERROR: Character animation movement top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (animation.side != 'center' && typeof animation.margins?.top != 'number') {
            console.error(`ERROR: Character animation top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          break
        }
        case 'jump': {
          if (animation.margins?.top == null) {
            console.error(`ERROR: Character animation top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (typeof animation.margins?.top != 'number') {
            console.error(`ERROR: Character animation top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          break
        }
        case 'fadeIn': {
          break
        }
        case 'fadeOut': {
          break
        }
        case 'rotate': {
          if (animation.degrees == null) {
            console.error(`ERROR: Character animation degrees not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (typeof animation.degrees != 'number') {
            console.error(`ERROR: Character animation degrees must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          break
        }
        case 'scale': {
          if (animation.scale == null) {
            console.error(`ERROR: Character animation scale not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          if (typeof animation.scale != 'number') {
            console.error(`ERROR: Character animation scale must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

            process.exit(1)
          }

          break
        }
      }

      if (animation.duration == null) {
        console.error(`ERROR: Character animation duratiton not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

        process.exit(1)
      }

      if (typeof animation.duration != 'number') {
        console.error(`ERROR: Character animation duratiton must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

        process.exit(1)
      }

      if (animation.delay == null) {
        console.error(`ERROR: Character animation delay not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

        process.exit(1)
      }

      if (typeof animation.delay != 'number') {
        console.error(`ERROR: Character animation delay must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

        process.exit(1)
      }

      if (animation.delay != 0)
        visualNovel.internalInfo.hasDelayedAnimation = true
    }
  }

  console.log(`Adding character "${options.name}" for scene "${scene.name}".. (Android)`)

  scene.characters.push({ name: options.name, image: options.image, position: options.position, animations: options.animations })

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

  visualNovel.internalInfo.hasSpeech = true

  console.log(`Speech added for scene "${scene.name}". (Android)`)

  return scene
}

function addSoundEffects(scene, options) {
  if (!Array.isArray(options)) {
    console.error(`ERROR: Sound effects must be an array.\n- Scene name: ${scene.name}`)

    process.exit(1)
  }

  for (let sound of options) {
    if (!sound?.sound) {
      console.error(`ERROR: Sound effects sound not provided.\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(sound.sound))) {
      console.error(`ERROR: Sound effects sound not found.\n- Scene name: ${scene.name}\n- Sound: ${options.sound}`)

      process.exit(1)
    }

    if (sound?.delay == null) {
      console.error(`ERROR: Sound effects delay not provided.\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (typeof sound.delay != 'number') {
      console.error(`ERROR: Sound effects delay must be a number.\n- Scene name: ${scene.name}`)

      process.exit(1)
    }

    if (sound.delay != 0)
      visualNovel.internalInfo.hasDelayedSoundEffect = true
  }

  console.log(`Adding sound effects for scene "${scene.name}".. (Android)`)

  scene.effect = options

  visualNovel.internalInfo.hasEffect = true
  
  console.log(`Sound effects added for scene "${scene.name}". (Android)`)

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

  visualNovel.internalInfo.hasSceneMusic = true

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
                  '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                  '    val resourceDisplayMetrics = getResources().getDisplayMetrics()' + '\n\n'

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

                    (character.animations ? '    val layoutParams_' + character.name + ' = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParams_' + character.name + '.gravity = Gravity.CENTER' + '\n\n' +
                      
                    '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' : '') +

                    '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

        break
      }
      case 'right':
      case 'left': {
        let dpiFunctions = ''
        if (character.position.side == 'left') {
          if (character.position.margins.side != 0) {
            dpiFunctions += '    val leftDp_' + character.name + ' = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, ' + character.position.margins.side + 'f, resourceDisplayMetrics).toInt()' + '\n'
          }
        } else {
          if (character.position.margins.side != 0) {
            dpiFunctions += '    val rightDp_' + character.name + ' = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, ' + character.position.margins.side + 'f, resourceDisplayMetrics).toInt()' + '\n'
          }
        }

        if (character.position.margins.top != 0) {
          dpiFunctions += '    val topDp_' + character.name + ' = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, ' + character.position.margins.top + 'f, resourceDisplayMetrics).toInt()' + '\n'
        }

        dpiFunctions += '\n'

        let layoutParams = '    layoutParams_' + character.name + '.setMargins('
        if (character.position.margins.side != 0) {
          layoutParams += character.position.side + 'Dp_' + character.name + ', '
        } else {
          layoutParams += '0, '
        }

        if (character.position.margins.top != 0) {
          layoutParams += 'topDp_' + character.name
        } else {
          layoutParams += '0'
        }

        layoutParams += ', 0, 0)'

        sceneCode += '    val imageView_' + character.name + ' = ImageView(this)' + '\n' +
                    '    imageView_' + character.name + '.setImageResource(R.raw.' + character.image + ')' + '\n' +
                    '    imageView_' + character.name + '.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    val layoutParams_' + character.name + ' = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    dpiFunctions +

                    '    layoutParams_' + character.name + '.gravity = Gravity.CENTER' + '\n' +
                    layoutParams + '\n\n' +

                    '    imageView_' + character.name + '.layoutParams = layoutParams_' + character.name + '\n\n' +

                    '    frameLayout.addView(imageView_' + character.name + ')' + '\n'

        break
      }
    }

    let SPACE = '    '
    const finalCode = []

    if (scene.transition) {
      SPACE += '    '

      sceneCode += '\n' + '    imageView_' + character.name + '.startAnimation(animationFadeIn)' + '\n\n' +

                   '    animationFadeIn.setAnimationListener(object : Animation.AnimationListener {' + '\n' +
                   '      override fun onAnimationStart(animation: Animation?) {}' + '\n\n' +

                   '      override fun onAnimationEnd(animation: Animation?) {' + '\n'

      finalCode.push(
        '      }' + '\n\n' +

        '      override fun onAnimationRepeat(animation: Animation?) {}' + '\n' +
        '    })' + '\n'
      )
    }
    
    let i = 0
    
    if (character.animations) for (let animation of character.animations) {
      if (animation.delay != 0) {
        sceneCode += SPACE + 'handler.postDelayed(object : Runnable {' + '\n' +
                     SPACE + '  override fun run() {' + '\n'

        finalCode.push(
          SPACE + '  }' + '\n' +
          SPACE + '}, ' + animation.delay + ')' + '\n'
        )

        SPACE += '    '
      }

      switch (animation.type) {
        case 'movement': {
          sceneCode += SPACE + 'imageView_' + character.name + '.animate()' + '\n' +
                       SPACE + '  .translationX(' + (animation.side == 'center' ? '((frameLayout.width - imageView_' + character.name + '.width) / 2).toFloat()' : animation.margins.side) + 'f)' + '\n' +
                       SPACE + '  .translationY(' + (animation.side == 'center' ? '((frameLayout.height - imageView_' + character.name + '.height) / 2).toFloat()' : animation.margins.top) + 'f)' + '\n' +
                       SPACE + '  .setDuration(' + animation.duration + ')' + '\n' +
                       SPACE + '  .setInterpolator(LinearInterpolator())' + '\n'

          break
        }
        case 'jump': {
          sceneCode += SPACE + 'imageView_' + character.name + '.animate()' + '\n' +
                       SPACE + '  .translationY(' + animation.margins.top + 'f)' + '\n' +
                       SPACE + '  .setDuration(' + animation.duration / 2 + ')' + '\n' +
                       SPACE + '  .setInterpolator(OvershootInterpolator())' + '\n' +
                       SPACE + '  .setListener(object : Animator.AnimatorListener {' + '\n' +
                       SPACE + '    override fun onAnimationStart(animation: Animator) {}' + '\n\n' +

                       SPACE + '    override fun onAnimationEnd(animation: Animator) {' + '\n' +
                       SPACE + '      imageView_' + character.name + '.animate()' + '\n' +
                       SPACE + '        .translationY(0f)' + '\n' +
                       SPACE + '        .setDuration(' + animation.duration / 2 + ')' + '\n' +
                       SPACE + '        .setInterpolator(OvershootInterpolator())' + '\n'

          finalCode.push(
            SPACE + '    }' + '\n\n' +

            SPACE + '    override fun onAnimationCancel(animation: Animator) {}' + '\n\n' +

            SPACE + '    override fun onAnimationRepeat(animation: Animator) {}' + '\n' +
            SPACE + '  })' + '\n'
          )

          SPACE += '      '

          break
        }
        case 'fadeIn':
        case 'fadeOut': {
          sceneCode += SPACE + 'imageView_' + character.name + '.animate()' + '\n' +
                       SPACE + '  .alpha(' + (animation.type == 'fadeIn' ? 1 : 0) + 'f)' + '\n' +
                       SPACE + '  .setDuration(' + animation.duration + ')' + '\n' +
                       SPACE + '  .setInterpolator(LinearInterpolator())' + '\n'

          break
        }
        case 'rotate': {
          sceneCode += SPACE + 'imageView_' + character.name + '.animate()' + '\n' +
                       SPACE + '  .rotation(' + animation.degrees + 'f)' + '\n' +
                       SPACE + '  .setDuration(' + animation.duration + ')' + '\n' +
                       SPACE + '  .setInterpolator(LinearInterpolator())' + '\n'

          break
        }
        case 'scale': {
          sceneCode += SPACE + 'imageView_' + character.name + '.animate()' + '\n' +
                       SPACE + '  .scaleX(' + animation.scale + 'f)' + '\n' +
                       SPACE + '  .scaleY(' + animation.scale + 'f)' + '\n' +
                       SPACE + '  .setDuration(' + animation.duration + ')' + '\n' +
                       SPACE + '  .setInterpolator(LinearInterpolator())' + '\n'

          break
        }
      }

      if (character.animations.length - 1 == i) {
        sceneCode += SPACE + '  .start()' + '\n'
      } else {
        sceneCode += SPACE + '  .setListener(object : Animator.AnimatorListener {' + '\n' +
                     SPACE + '    override fun onAnimationStart(animation: Animator) {}' + '\n\n' +

                     SPACE + '    override fun onAnimationEnd(animation: Animator) {' + '\n'

        finalCode.push(
          SPACE + '    }' + '\n\n' +

          SPACE + '    override fun onAnimationCancel(animation: Animator) {}' + '\n\n' +

          SPACE + '    override fun onAnimationRepeat(animation: Animator) {}' + '\n' +
          SPACE + '  })' + '\n' +
          SPACE + '  .start()' + '\n'
        )

        SPACE += '      '
      }

      i++
    }

    if (finalCode.length != 0) {
      finalCode.reverse()

      sceneCode += finalCode.join('')
    }
  }

  if (scene.speech) {
    sceneCode += '\n' + '    val rectangleViewSpeech = RectangleView(this)' + '\n\n' +

                 '    val bottomDpRectangles = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 76.25f, resourceDisplayMetrics).toInt()' + '\n\n' +

                 '    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, bottomDpRectangles)' + '\n' +
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

                 '    val fontSizeSpeech = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, ' + scene.speech.text.fontSize + 'f, resourceDisplayMetrics)' + '\n\n' +

                 '    val textViewSpeech = TextView(this)' + '\n' +
                 '    textViewSpeech.textSize = fontSizeSpeech' + '\n' +
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
                 '    layoutParamsRectangleAuthor.setMargins(0, 0, 0, bottomDpRectangles)' + '\n\n' +

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

                 (scene.speech.author.name ? '\n\n' + '    val fontSizeAuthor = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 7f, resourceDisplayMetrics)' + '\n\n' +

                 '    val textViewAuthor = TextView(this)' + '\n' +
                 '    textViewAuthor.text = "' + scene.speech.author.name + '"' + '\n' +
                 '    textViewAuthor.textSize = fontSizeAuthor' + '\n' +
                 '    textViewAuthor.setTextColor(0xFF' + scene.speech.author.textColor + '.toInt())' + '\n\n' +

                 '    val layoutParamsAuthor = LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +

                 '    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                 '    layoutParamsAuthor.setMargins(400, 0, 0, bottomDpRectangles)' + '\n\n' +

                 '    textViewAuthor.layoutParams = layoutParamsAuthor' + '\n\n' +

                 (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech || (visualNovel.scenes.length != 0 && scene.speech?.author?.name && visualNovel.scenes[visualNovel.scenes.length - 1].speech && !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name) ? ('    ' + (visualNovel.scenes.length != 0 && scene.speech?.author?.name && visualNovel.scenes[visualNovel.scenes.length - 1].speech && !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name ? 'if (animateAuthor) {' : 'if (animate) {') + '\n' + 
                 '      val animationAuthor = AlphaAnimation(0f, 1f)' + '\n' +
                 '      animationAuthor.duration = 1000'  + '\n' +
                 '      animationAuthor.interpolator = LinearInterpolator()' + '\n' +
                 '      animationAuthor.fillAfter = true' + '\n\n' +

                 '      textViewAuthor.startAnimation(animationAuthor)' + '\n' +
                 '    }' + '\n\n') : '') +

                 '    frameLayout.addView(textViewAuthor)' : '') + '\n'
  }

  if (scene.music || scene.effect) {
    let finalCode = []

    if (scene.music) {
      let SPACE = '    '

      if (scene.music.delay != 0) {
        SPACE += '    '

        sceneCode += '\n' + '    handler.postDelayed(object : Runnable {' + '\n' +
                      '      override fun run() {' + '\n'

        finalCode.push(
          '      }' + '\n' +
          '    }, ' + scene.music.delay + ')' + '\n'
        )
      } else {
        sceneCode += '\n'
      }

      sceneCode += SPACE + 'mediaPlayer = MediaPlayer.create(this, R.raw.' + scene.music.music + ')' + '\n\n' +

                    SPACE + 'if (mediaPlayer != null) {' + '\n' +
                    SPACE + '  mediaPlayer!!.start()' + '\n\n' +

                    SPACE + '  mediaPlayer!!.setVolume(musicVolume, musicVolume)' + '\n\n' +

                    SPACE + '  mediaPlayer!!.setOnCompletionListener {' + '\n' +
                    SPACE + '    if (mediaPlayer != null) {' + '\n' +
                    SPACE + '      mediaPlayer!!.stop()' + '\n' +
                    SPACE + '      mediaPlayer!!.release()' + '\n' +
                    SPACE + '      mediaPlayer = null' + '\n' +
                    SPACE + '    }' + '\n' +
                    SPACE + '  }' + '\n' +
                    SPACE + '}' + '\n'

      if (finalCode.length != 0) {
        finalCode.reverse()

        sceneCode += finalCode.join('')
      }
    }

    if (finalCode.length != 0) {
      finalCode.reverse()

      sceneCode += finalCode.join('')
    }

    if (scene.effect) for (let effect of scene.effect) {
      let SPACE = '    '

      if (effect.delay != 0) {
        SPACE += '    '

        sceneCode += '\n' + '    handler.postDelayed(object : Runnable {' + '\n' +
                     '      override fun run() {' + '\n'

        finalCode.push(
          '      }' + '\n' +
          '    }, ' + effect.delay + 'L)' + '\n'
        )
      } else {
        sceneCode += '\n'
      }

      let mediaPlayerName = 'mediaPlayer'
      if (scene.music) mediaPlayerName = 'mediaPlayer2'

      sceneCode += SPACE + mediaPlayerName + ' = MediaPlayer.create(this@MainActivity, R.raw.' + effect.sound + ')' + '\n\n' +
                   SPACE + 'if (' + mediaPlayerName + ' != null) {' + '\n' +
                   SPACE + '  ' + mediaPlayerName + '!!.start()' + '\n\n' +

                   SPACE + '  ' + mediaPlayerName + '!!.setVolume(sEffectVolume, sEffectVolume)' + '\n\n' +

                   SPACE + '  ' + mediaPlayerName + '!!.setOnCompletionListener {' + '\n' +
                   SPACE + '    if (' + mediaPlayerName + ' != null) {' + '\n' +
                   SPACE + '      ' + mediaPlayerName + '!!.stop()' + '\n' +
                   SPACE + '      ' + mediaPlayerName + '!!.release()' + '\n' +
                   SPACE + '      ' + mediaPlayerName + ' = null' + '\n' +
                   SPACE + '    }' + '\n' +
                   SPACE + '  }' + '\n' +
                   SPACE + '}' + '\n'

      if (finalCode.length != 0) {
        finalCode.reverse()
  
        sceneCode += finalCode.join('')

        finalCode = []
      }
    }
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

  sceneCode += '\n' + '    val fontSizeButtons = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 3.5f, resourceDisplayMetrics)' + '\n\n' +

               '    val buttonMenu = Button(this)' + '\n' +
               '    buttonMenu.text = "Menu" + fontSizeButtons' + '\n' +
               '    buttonMenu.textSize = fontSizeButtons' + '\n' +
               '    buttonMenu.setTextColor(0xFF' + options.buttonsColor + '.toInt())' + '\n' +
               '    buttonMenu.background = null' + '\n\n' +

               '    val layoutParamsMenu = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '   val leftDpButtons = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 19f, resourceDisplayMetrics).toInt()' + '\n\n' +

               '    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsMenu.setMargins(leftDpButtons, 0, 0, 0)' + '\n\n' +

               '    buttonMenu.layoutParams = layoutParamsMenu' + '\n\n' +

               (finishScene.length != 0 ? '    buttonMenu.setOnClickListener {' + '\n' + finishScene.join('\n\n') + '\n' + '__PERFORVNM_START_MUSIC__' + '\n\n'  : '    buttonMenu.setOnClickListener {__PERFORVNM_START_MUSIC__' + '\n\n') +

               '      ' + (visualNovel.menu ? visualNovel.menu.name : '__PERFORVNM_MENU__') + '\n' +
               '    }' + '\n\n' +

               '    frameLayout.addView(buttonMenu)' + '\n\n' +

               (visualNovel.scenes.length != 0 ? '    val buttonBack = Button(this)' + '\n' +
               '    buttonBack.text = "Back"' + '\n' +
               '    buttonBack.textSize = fontSizeButtons' + '\n' +
               '    buttonBack.setTextColor(0xFF' + options.buttonsColor + '.toInt())' + '\n' + 
               '    buttonBack.background = null' + '\n\n' +

               '    val layoutParamsBack = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '    val topDpBack = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 30.5f, resourceDisplayMetrics).toInt()' + '\n\n' +

               '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsBack.setMargins(leftDpButtons, topDpBack, 0, 0)' + '\n\n' +

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
  addSoundEffects,
  addMusic,
  addTransition,
  finalize
}