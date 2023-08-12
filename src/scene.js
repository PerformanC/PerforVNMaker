import fs from 'fs'

function init(options) {
  if (['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'].includes(options?.name))
    throw new Error(`Scene name cannot be ${options.name}. (Android)`)

  if (visualNovel.scenes.find(scene => scene.name == options.name))
    throw new Error('Scene with duplicated name.\n- Scene name: ' + options.name)

  console.log('Starting scene.. (Android)')

  return { name: options.name, characters: [], background: null, speech: null, effect: null, music: null, transition: null }
}

function addCharacter(scene, options) {
  if (!options?.name)
    throw new Error(`Character name not provided.\n- Scene name: ${scene.name}`)

  if (scene.characters.find(character => character.name == options.name))
    throw new Error(`Character already exists.\n- Character name: ${options.name}\n- Scene name: ${scene.name}\n- Image: ${options.image}\n- Position: ${options.position}`)

  if (!options.image)
    throw new Error(`Character image not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (!fs.readdirSync(`${visualNovel.info.paths.android}/app/src/main/res/raw`).find((file) => file.startsWith(options.image)))
    throw new Error(`Character image not found.\n- Character name: ${options.name}\n- Scene name: ${scene.name}\n- Image: ${options.image}`)

  if (!options.position?.side)
    throw new Error(`Character position side not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (!['center', 'left', 'right'].includes(options.position.side))
    throw new Error(`Character position side not valid, it must be either center, left or right.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (options.position.side != 'center' && options.position.margins?.side == null)
    throw new Error(`Character position side margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (options.position.side != 'center' && typeof options.position.margins?.side != 'number')
    throw new Error(`Character position margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (options.position.side != 'center' && options.position.margins?.top == null)
    throw new Error(`Character position top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (options.position.side != 'center' && typeof options.position.margins?.top != 'number')
    throw new Error(`Character position top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

  if (options.animations) {
    if (!Array.isArray(options.animations))
      throw new Error(`Character animations must be an array.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

    for (let animation of options.animations) {
      if (!animation.type)
        throw new Error(`Character animation type not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      if (!['movement', 'jump', 'fadeIn', 'fadeOut', 'rotate', 'scale'].includes(animation.type))
        throw new Error(`Character animation type not valid, it must be either movement, jump, fade, rotate or scale.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      switch (animation.type) {
        case 'movement': {
          if (!animation.side)
            throw new Error(`Character animation movement side not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (!['center', 'left', 'right'].includes(animation.side))
            throw new Error(`Character animation movement side not valid, it must be either center, left or right.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (animation.side != 'center' && animation.margins?.side == null)
            throw new Error(`Character animation movement side margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (animation.side != 'center' && typeof animation.margins?.side != 'number')
            throw new Error(`Character animation movement side margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (animation.side != 'center' && animation.margins.top == null)
            throw new Error(`Character animation movement top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (animation.side != 'center' && typeof animation.margins?.top != 'number')
            throw new Error(`Character animation top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          break
        }
        case 'jump': {
          if (animation.margins?.top == null)
            throw new Error(`Character animation top margin not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (typeof animation.margins?.top != 'number')
            throw new Error(`Character animation top margin must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          break
        }
        case 'fadeIn': {
          break
        }
        case 'fadeOut': {
          break
        }
        case 'rotate': {
          if (animation.degrees == null)
            throw new Error(`Character animation degrees not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (typeof animation.degrees != 'number')
            throw new Error(`Character animation degrees must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          break
        }
        case 'scale': {
          if (animation.scale == null)
            throw new Error(`Character animation scale not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          if (typeof animation.scale != 'number')
            throw new Error(`Character animation scale must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

          break
        }
      }

      if (animation.duration == null)
        throw new Error(`Character animation duratiton not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      if (typeof animation.duration != 'number')
        throw new Error(`Character animation duratiton must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      if (animation.delay == null)
        throw new Error(`Character animation delay not provided.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

      if (typeof animation.delay != 'number')
        throw new Error(`Character animation delay must be a number.\n- Character name: ${options.name}\n- Scene name: ${scene.name}`)

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
  if (!options?.image)
    throw new Error(`Scenario image not provided.\n- Scene name: ${scene.name}`)

  if (!fs.readdirSync(`${visualNovel.info.paths.android}/app/src/main/res/raw`).find((file) => file.startsWith(options.image)))
    throw new Error(`Scenario image not found.\n- Scene name: ${scene.name}\n- Image: ${options.image}`)

  console.log(`Adding scenario for scene "${scene.name}".. (Android)`)

  scene.background = options.image

  console.log(`Scenario added for scene "${scene.name}". (Android)`)

  return scene
}

function addSpeech(scene, options) {
  if (options.author?.name && !options.author.textColor)
    throw new Error(`Speech author text color not provided.\n- Scene name: ${scene.name}`)

  if (!options?.author?.rectangle?.color)
    throw new Error(`Speech author rectangle color not provided.\n- Scene name: ${scene.name}`)

  if (!options?.author?.rectangle?.opacity)
    throw new Error(`Speech author rectangle opacity not provided.\n- Scene name: ${scene.name}`)

  if (typeof options.author.rectangle.opacity != 'number')
    throw new Error(`Speech author rectangle opacity must be a number.\n- Scene name: ${scene.name}`)

  if (!options.text?.content)
    throw new Error(`Speech text content not provided.\n- Scene name: ${scene.name}`)

  if (!options.text.color)
    throw new Error(`Speech text color not provided.\n- Scene name: ${scene.name}`)

  if (!options.text.fontSize)
    throw new Error(`Speech text font size not provided.\n- Scene name: ${scene.name}`)

  if (!options.text.rectangle?.color)
    throw new Error(`Speech text rectangle color not provided.\n- Scene name: ${scene.name}`)

  if (!options.text.rectangle?.opacity)
    throw new Error(`Speech text rectangle opacity not provided.\n- Scene name: ${scene.name}`)

  if (typeof options.text.rectangle.opacity != 'number')
    throw new Error(`Speech text rectangle opacity must be a number.\n- Scene name: ${scene.name}`)

  console.log(`Adding speech for scene "${scene.name}".. (Android)`)

  scene.speech = options
  scene.speech.text.content = JSON.stringify(options.text.content).slice(1, -1)

  visualNovel.internalInfo.hasSpeech = true

  console.log(`Speech added for scene "${scene.name}". (Android)`)

  return scene
}

function addSoundEffects(scene, options) {
  if (!Array.isArray(options))
    throw new Error(`Sound effects must be an array.\n- Scene name: ${scene.name}`)

  for (let sound of options) {
    if (!sound?.sound)
      throw new Error(`Sound effects sound not provided.\n- Scene name: ${scene.name}`)

    if (!fs.readdirSync(`${visualNovel.info.paths.android}/app/src/main/res/raw`).find((file) => file.startsWith(sound.sound)))
      throw new Error(`Sound effects sound not found.\n- Scene name: ${scene.name}\n- Sound: ${options.sound}`)

    if (sound?.delay == null)
      throw new Error(`Sound effects delay not provided.\n- Scene name: ${scene.name}`)

    if (typeof sound.delay != 'number')
      throw new Error(`Sound effects delay must be a number.\n- Scene name: ${scene.name}`)

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
  if (!options?.music)
    throw new Error(`Scene music not provided.\n- Scene name: ${scene.name}`)

  if (!fs.readdirSync(`${visualNovel.info.paths.android}/app/src/main/res/raw`).find((file) => file.startsWith(options.music)))
    throw new Error(`Scene music not found.\n- Scene name: ${scene.name}\n- Music: ${options.music}`)

  if (options?.delay == null)
    throw new Error(`Scene music delay not provided.\n- Scene name: ${scene.name}`)

  if (options.delay && typeof options.delay != 'number')
    throw new Error(`Scene music delay must be a number.\n- Scene name: ${scene.name}`)

  console.log(`Adding music for scene "${scene.name}".. (Android)`)

  scene.music = options

  visualNovel.internalInfo.hasSceneMusic = true

  console.log(`Music added for scene "${scene.name}". (Android)`)

  return scene
}

function addTransition(scene, options) {
  if (!options?.duration)
    throw new Error(`Scene transition duration not provided.\n- Scene name: ${scene.name}`)

  if (typeof options.duration != 'number')
    throw new Error(`Scene transition duration must be a number.\n- Scene name: ${scene.name}`)

  console.log(`Adding transition for scene "${scene.name}".. (Android)`)

  scene.transition = options

  console.log(`Transition added for scene "${scene.name}". (Android)`)

  return scene
}

function finalize(scene, options) {
  if (!options?.buttonsColor)
    throw new Error(`Scene "back" text color not provided.\n- Scene name: ${scene.name}`)

  if (!options.footerTextColor)
    throw new Error(`Scene text color not provided.\n- Scene name: ${scene.name}`)

  console.log(`Ending scene, coding scene "${scene.name}".. (Android)`)

  let sceneCode = `  private fun ${scene.name}(__PERFORVNM_SCENE_PARAMS__) {` + '\n' +
                  '    val frameLayout = FrameLayout(this)' + '\n' +
                  '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n'

  if ((scene.characters.length != 0 || scene.background != '') && scene.transition) {
    sceneCode += '    val animationFadeIn = AlphaAnimation(0f, 1f)' + '\n' +
                 `    animationFadeIn.duration = ${scene.transition.duration}` + '\n' +
                 '    animationFadeIn.interpolator = LinearInterpolator()' + '\n' +
                 '    animationFadeIn.fillAfter = true' + '\n\n'
  }

  if (scene.background != '') {
    sceneCode += '    val imageView_scenario = ImageView(this)' + '\n' +
                 `    imageView_scenario.setImageResource(R.raw.${scene.background})` + '\n' +
                 '    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                 '    frameLayout.addView(imageView_scenario)' + '\n\n'

    if (scene.transition)
      sceneCode += '    imageView_scenario.startAnimation(animationFadeIn)' + '\n\n'
  }

  for (let character of scene.characters) {
    switch (character.position.side) {
      case 'center': {
        sceneCode += `    val imageView_${character.name} = ImageView(this)` + '\n' +
                     `    imageView_${character.name}.setImageResource(R.raw.${character.image})` + '\n' +
                     `    imageView_${character.name}.scaleType = ImageView.ScaleType.FIT_CENTER` + '\n\n'

        if (character.animations) {
          sceneCode += `    val layoutParams_${character.name} = LayoutParams(` + '\n' +
                        '      LayoutParams.WRAP_CONTENT,' + '\n' +
                        '      LayoutParams.WRAP_CONTENT' + '\n' +
                        '    )' + '\n\n' +

                        `    layoutParams_${character.name}.gravity = Gravity.CENTER` + '\n\n' +

                        `    imageView_${character.name}.layoutParams = layoutParams_${character.name}` + '\n\n'
        }

        sceneCode += `    frameLayout.addView(imageView_${character.name})` + '\n'

        break
      }
      case 'right':
      case 'left': {
        let dpiFunctions = ''
        if (character.position.margins.side != 0) {
          dpiFunctions += `    val ${character.position.side}Dp_${character.name} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${character.position.margins.side}sdp)` + '\n'
        }

        if (character.position.margins.top != 0) {
          dpiFunctions += `    val topDp_${character.name} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${character.position.margins.top}sdp)` + '\n'
        }

        dpiFunctions += '\n'

        let layoutParams = `    layoutParams_${character.name}.setMargins(`
        if (character.position.margins.side != 0 && character.position.side == 'left') {
          layoutParams += `${character.position.side}Dp_${character.name}, `
        } else {
          layoutParams += '0, '
        }

        if (character.position.margins.top != 0) {
          layoutParams += `topDp_${character.name}, `
        } else {
          layoutParams += '0, '
        }

        if (character.position.margins.side != 0 && character.position.side == 'right') {
          layoutParams += `${character.position.side}Dp_${character.name}, `
        } else {
          layoutParams += '0, '
        }

        layoutParams += '0)'

        sceneCode += `    val imageView_${character.name} = ImageView(this)` + '\n' +
                     `    imageView_${character.name}.setImageResource(R.raw.${character.image})` + '\n' +
                     `    imageView_${character.name}.scaleType = ImageView.ScaleType.FIT_CENTER` + '\n\n' +

                     `    val layoutParams_${character.name} = LayoutParams(` + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n' +

                     dpiFunctions +

                     `    layoutParams_${character.name}.gravity = Gravity.CENTER` + '\n' +
                     layoutParams + '\n\n' +

                     `    imageView_${character.name}.layoutParams = layoutParams_${character.name}` + '\n\n' +

                     `    frameLayout.addView(imageView_${character.name})` + '\n'

        break
      }
    }

    let SPACE = '    '
    const finalCode = []

    if (scene.animations) {
      SPACE += '    '

      sceneCode += '\n' + `    imageView_${character.name}.startAnimation(animationFadeIn)` + '\n\n' +

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
          SPACE + `}, ${animation.delay})` + '\n'
        )

        SPACE += '    '
      }

      if (animation.type == 'jump') {
        sceneCode += SPACE + `imageView_${character.name}.animate()` + '\n' +
                    SPACE + `  .translationY(${animation.margins.top}f)` + '\n' +
                    SPACE + `  .setDuration(${animation.duration / 2})` + '\n' +
                    SPACE + '  .setInterpolator(OvershootInterpolator())' + '\n' +
                    SPACE + '  .setListener(object : Animator.AnimatorListener {' + '\n' +
                    SPACE + '    override fun onAnimationStart(animation: Animator) {}' + '\n\n' +

                    SPACE + '    override fun onAnimationEnd(animation: Animator) {' + '\n' +
                    SPACE + `      imageView_${character.name}.animate()` + '\n' +
                    SPACE + '        .translationY(0f)' + '\n' +
                    SPACE + `        .setDuration(${animation.duration / 2})` + '\n' +
                    SPACE + '        .setInterpolator(OvershootInterpolator())' + '\n'

        finalCode.push(
          SPACE + '    }' + '\n\n' +

          SPACE + '    override fun onAnimationCancel(animation: Animator) {}' + '\n\n' +

          SPACE + '    override fun onAnimationRepeat(animation: Animator) {}' + '\n' +
          SPACE + '  })' + '\n'
        )

        SPACE += '      '
      } else {
        sceneCode += SPACE + `imageView_${character.name}.animate()` + '\n'

        switch (animation.type) {
          case 'movement': {
            sceneCode += SPACE + `  .translationX(${(animation.side == 'center' ? '((frameLayout.width - imageView_' + character.name + '.width) / 2).toFloat()' : animation.margins.side)}f)` + '\n' +
                         SPACE + `  .translationY(${(animation.side == 'center' ? '((frameLayout.height - imageView_' + character.name + '.height) / 2).toFloat()' : animation.margins.top)}f)` + '\n'

            break
          }
          case 'fadeIn':
          case 'fadeOut': {
            sceneCode += SPACE + `  .alpha(${(animation.type == 'fadeIn' ? 1 : 0)}f)` + '\n'

            break
          }
          case 'rotate': {
            sceneCode += SPACE + `  .rotation(${animation.degrees}f)` + '\n'

            break
          }
          case 'scale': {
            sceneCode += SPACE + `  .scaleX(${animation.scale}f)` + '\n' +
                         SPACE + `  .scaleY(${animation.scale}f)` + '\n'

            break
          }
        }

        sceneCode += SPACE + `  .setDuration(${animation.duration})` + '\n' +
                     SPACE + '  .setInterpolator(LinearInterpolator())' + '\n'
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

                 '    val bottomDpRectangles = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)' + '\n\n' +

                 '    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, bottomDpRectangles)' + '\n' +
                 '    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                 '    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech' + '\n'

    if (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += `    rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)` + '\n'
    }

    sceneCode += `    rectangleViewSpeech.setColor(0xFF${scene.speech.text.rectangle.color}.toInt())` + '\n'

    if (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode +=  '\n' + '    if (animate) {' + '\n' +
                    `      val animationRectangleSpeech = AlphaAnimation(0f, ${scene.speech.text.rectangle.opacity}f)` + '\n' +
                    '      animationRectangleSpeech.duration = 1000'  + '\n' +
                    '      animationRectangleSpeech.interpolator = LinearInterpolator()' + '\n' +
                    '      animationRectangleSpeech.fillAfter = true' + '\n\n' +

                    '      rectangleViewSpeech.startAnimation(animationRectangleSpeech)' + '\n' +
                    '    } else {' + '\n' +
                    `      rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)` + '\n' +
                    '    }' + '\n\n'
    } else {
      sceneCode += '\n'
    }

    sceneCode += '    frameLayout.addView(rectangleViewSpeech)' + '\n\n' +

                 '    val textViewSpeech = TextView(this)' + '\n' +
                 `    textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${scene.speech.text.fontSize}ssp))` + '\n' +
                 `    textViewSpeech.setTextColor(0xFF${scene.speech.text.color}.toInt())` + '\n\n' +

                 '    val layoutParamsSpeech = LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +

                 '    layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)' + '\n\n' +

                 '    textViewSpeech.layoutParams = layoutParamsSpeech' + '\n\n' +

                 `    var speechText = "${scene.speech.text.content}"__PERFORVNM_SPEECH_HANDLER__` + '\n' +
                 '    frameLayout.addView(textViewSpeech)' + '\n\n' +

                 '    val rectangleViewAuthor = RectangleView(this)' + '\n\n' +

                 '    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)' + '\n' +
                 '    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsRectangleAuthor.setMargins(0, 0, 0, bottomDpRectangles)' + '\n\n' +

                 '    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor' + '\n'

    if (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += `    rectangleViewAuthor.setAlpha(${scene.speech.author.rectangle.opacity}f)` + '\n'
    }

    sceneCode += `    rectangleViewAuthor.setColor(0xFF${scene.speech.author.rectangle.color}.toInt())` + '\n\n'

    if (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += '    if (animate) {' + '\n' +
                   `      val animationRectangleAuthor = AlphaAnimation(0f, ${scene.speech.author.rectangle.opacity}f)` + '\n' +
                   '      animationRectangleAuthor.duration = 1000' + '\n' +
                   '      animationRectangleAuthor.interpolator = LinearInterpolator()' + '\n' +
                   '      animationRectangleAuthor.fillAfter = true' + '\n\n' +

                   '      rectangleViewAuthor.startAnimation(animationRectangleAuthor)' + '\n' +
                   '    } else {' + '\n' +
                   `      rectangleViewAuthor.setAlpha(${scene.speech.author.rectangle.opacity}f)` + '\n' + 
                   '    }' + '\n\n'
    }

    sceneCode += '    frameLayout.addView(rectangleViewAuthor)'

    if (scene.speech.author.name) {
      sceneCode += '\n\n' + '    val textViewAuthor = TextView(this)' + '\n' +
                   `    textViewAuthor.text = "${scene.speech.author.name}"` + '\n' +
                   '    textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                   `    textViewAuthor.setTextColor(0xFF${scene.speech.author.textColor}.toInt())` + '\n\n' +

                   '    val layoutParamsAuthor = LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, bottomDpRectangles)' + '\n\n' +

                   '    textViewAuthor.layoutParams = layoutParamsAuthor' + '\n\n'

                  if (
                    visualNovel.scenes.length == 0 ||
                    !visualNovel.scenes[visualNovel.scenes.length - 1].speech ||
                    (visualNovel.scenes.length != 0 &&
                      scene.speech?.author?.name &&
                      visualNovel.scenes[visualNovel.scenes.length - 1].speech &&
                      !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name)
                    ) {
                      if (visualNovel.scenes.length != 0 && scene.speech?.author?.name && visualNovel.scenes[visualNovel.scenes.length - 1].speech && !visualNovel.scenes[visualNovel.scenes.length - 1].speech?.author?.name) {
                        sceneCode += '    if (animateAuthor) {'
                      } else {
                        sceneCode += '    if (animate) {'
                      }

                      sceneCode += '\n' + '      val animationAuthor = AlphaAnimation(0f, 1f)' + '\n' +
                                   '      animationAuthor.duration = 1000'  + '\n' +
                                   '      animationAuthor.interpolator = LinearInterpolator()' + '\n' +
                                   '      animationAuthor.fillAfter = true' + '\n\n' +

                                   '      textViewAuthor.startAnimation(animationAuthor)' + '\n' +
                                   '    }' + '\n\n'
                    }


      sceneCode += '    frameLayout.addView(textViewAuthor)'
    }

    sceneCode += '\n'
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
          `    }, ${scene.music.delay})` + '\n'
        )
      } else {
        sceneCode += '\n'
      }

      sceneCode += SPACE + `mediaPlayer = MediaPlayer.create(this, R.raw.${scene.music.music})` + '\n\n' +

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

        finalCode = []
      }
    }

    if (scene.effect) for (let effect of scene.effect) {
      let SPACE = '    '

      if (effect.delay != 0) {
        SPACE += '    '

        sceneCode += '\n' + '    handler.postDelayed(object : Runnable {' + '\n' +
                     '      override fun run() {' + '\n'

        finalCode.push(
          '      }' + '\n' +
          `    }, ${effect.delay}L)` + '\n'
        )
      } else {
        sceneCode += '\n'
      }

      let mediaPlayerName = 'mediaPlayer'
      if (scene.music) mediaPlayerName = 'mediaPlayer2'

      sceneCode += SPACE + `${mediaPlayerName} = MediaPlayer.create(this@MainActivity, R.raw.${effect.sound})` + '\n\n' +
                   SPACE + `if (${mediaPlayerName} != null) {` + '\n' +
                   SPACE + `  ${mediaPlayerName}!!.start()` + '\n\n' +

                   SPACE + `  ${mediaPlayerName}!!.setVolume(sEffectVolume, sEffectVolume)` + '\n\n' +

                   SPACE + `  ${mediaPlayerName}!!.setOnCompletionListener {` + '\n' +
                   SPACE + `    if (${mediaPlayerName} != null) {` + '\n' +
                   SPACE + `      ${mediaPlayerName}!!.stop()` + '\n' +
                   SPACE + `      ${mediaPlayerName}!!.release()` + '\n' +
                   SPACE + `      ${mediaPlayerName} = null` + '\n' +
                   SPACE + '    }' + '\n' +
                   SPACE + '  }' + '\n' +
                   SPACE + '}' + '\n'

      if (finalCode.length != 0) {
        finalCode.reverse()

        sceneCode += finalCode.join('')
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

  sceneCode += '\n' + '    val buttonSave = Button(this)' + '\n' +
               '    buttonSave.text = "Save"' + '\n' +
               '    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))' + '\n' +
               `    buttonSave.setTextColor(0xFF${options.buttonsColor}.toInt())` + '\n' +
               '    buttonSave.background = null' + '\n\n' +

               '    val layoutParamsSave = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '    val leftDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)' + '\n\n' +

               '    layoutParamsSave.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsSave.setMargins(leftDpButtons, 0, 0, 0)' + '\n\n' +

               '    buttonSave.layoutParams = layoutParamsSave' + '\n\n' +

               '    buttonSave.setOnClickListener {' + '\n' +
               '      val inputStream = openFileInput("saves.json")' + '\n' +
               '      var saves = inputStream.bufferedReader().use { it.readText() }' + '\n' +
               '      inputStream.close()' + '\n\n'

  let sceneJson = {}

  if (scene.background != '') {
    sceneJson.scenario = scene.background
  }

  sceneJson.scene = scene.name

  if (scene.characters.length != 0) {
    sceneJson.characters = []

    scene.characters.forEach((character) => {
      let positionType = character.position.side

      if (character.position.side != 'center') {
        if (character.position.margins.top != 0)
          positionType += 'Top'

        if (character.position.margins.side == 0 && character.position.margins.top != 0)
          positionType = 'top'
      }

      sceneJson.characters.push({
        name: character.name,
        image: character.image,
        position: {
          sideType: positionType,
          ...(character.position.side == 'center' ? {} : {
            side: character.position.margins.side,
            ...(character.position.margins.top == 0 ? {} : { top: character.position.margins.top })
          })
        }
      })
    })
  }

  sceneCode += `      val newSave = "${JSON.stringify(JSON.stringify(sceneJson)).slice(1, -1)}"` + '\n\n' +

               '      saves = saves.dropLast(1) + "," + newSave + "]"' + '\n\n' +

               '      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)' + '\n' +
               '      outputStream.write(saves.toByteArray())' + '\n' +
               '      outputStream.close()' + '\n' +
               '    }' + '\n\n' +
               
                '    frameLayout.addView(buttonSave)' + '\n\n' +
  
               '    val buttonMenu = Button(this)' + '\n' +
               '    buttonMenu.text = "Menu"' + '\n' +
               '    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))' + '\n' +
               `    buttonMenu.setTextColor(0xFF${options.buttonsColor}.toInt())` + '\n' +
               '    buttonMenu.background = null' + '\n\n' +

               '    val layoutParamsMenu = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '    val topDpMenu = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp)' + '\n\n' +

               '    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsMenu.setMargins(leftDpButtons, topDpMenu, 0, 0)' + '\n\n' +

               '    buttonMenu.layoutParams = layoutParamsMenu' + '\n\n'

  if (finishScene.length != 0) {
    sceneCode += '    buttonMenu.setOnClickListener {' + '\n' +
                 finishScene.join('\n\n') + '\n' +

                 '__PERFORVNM_START_MUSIC__' + '\n\n'
  } else {
    sceneCode += '    buttonMenu.setOnClickListener {__PERFORVNM_START_MUSIC__' + '\n\n'
  }

  sceneCode += '      ' + (visualNovel.menu ? visualNovel.menu.name : '__PERFORVNM_MENU__') + '\n' +
               '    }' + '\n\n' +

               '    frameLayout.addView(buttonMenu)' + '\n\n'
  if (visualNovel.scenes.length != 0) {
    sceneCode += '    val buttonBack = Button(this)' + '\n' +
                  '    buttonBack.text = "Back"' + '\n' +
                  '    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))' + '\n' +
                  `    buttonBack.setTextColor(0xFF${options.buttonsColor}.toInt())` + '\n' +
                  '    buttonBack.background = null' + '\n\n' +

                  '    val layoutParamsBack = LayoutParams(' + '\n' +
                  '      LayoutParams.WRAP_CONTENT,' + '\n' +
                  '      LayoutParams.WRAP_CONTENT' + '\n' +
                  '    )' + '\n\n' +

                  '    val topDpBack = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp)' + '\n\n' +

                  '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
                  '    layoutParamsBack.setMargins(leftDpButtons, topDpBack, 0, 0)' + '\n\n' +

                  '    buttonBack.layoutParams = layoutParamsBack' + '\n\n'

    if (finishScene.length != 0) {
      sceneCode += '    buttonBack.setOnClickListener {' + '\n' +
                   finishScene.join('\n\n') + '\n\n'
    } else {
      sceneCode += '    buttonBack.setOnClickListener {\n'
    }

      sceneCode += `      ${visualNovel.scenes[visualNovel.scenes.length - 1].name}(${(visualNovel.scenes[visualNovel.scenes.length - 1].speech ? 'false' : '' )})` + '\n' +
                   '    }' + '\n\n' +

                    '    frameLayout.addView(buttonBack)' + '\n\n'
  }

  sceneCode += `    setContentView(frameLayout)__PERFORVNM_SCENE_${scene.name.toUpperCase()}__` + '\n' +
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
