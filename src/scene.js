import fs from 'fs'

import helper from './helper.js'

function init(options) {
  const checks = {
    'name': {
      type: 'string',
      notValues: ['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'],
      extraVerification: (param) => {
        if (visualNovel.scenes.find((scene) => scene.name == param))
          helper.logFatal('A scene already exists with this name.')
      }
    }
  }

  helper.verifyParams(checks, options)

  return { name: options.name, type: 'normal', next: null, characters: [], subScenes: [], background: null, speech: null, effect: null, music: null, transition: null, custom: [] }
}

function addCharacter(scene, options) {
  const checks = {
    'name': {
      type: 'string',
      extraVerification: (param) => {
        if (scene.characters.find(character => character.name == param))
          helper.logFatal('A character already exists with this name.')
      }
    },
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: ['center', 'left', 'right']
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          },
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent.position.side != 'center'
          }
        }
      }
    },
    'animations': {
      type: 'array',
      params: {
        'type': {
          type: 'string',
          values: ['movement', 'jump', 'fadeIn', 'fadeOut', 'rotate', 'scale']
        },
        'side': {
          type: 'string',
          values: ['center', 'left', 'right'],
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent.animations[additionalinfo.index].type == 'movement'
          }
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          },
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent.animations[additionalinfo.index].type == 'movement'
          },
          required: false
        },
        'degrees': {
          type: 'number',
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent.animations[additionalinfo.index].type == 'rotate'
          }
        },
        'scale': {
          type: 'number',
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent.animations[additionalinfo.index].type == 'scale'
          }
        },
        'duration': {
          type: 'number',
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent.animations[additionalinfo.index].type != 'jump'
          }
        },
        'delay': {
          type: 'number',
          required: false
        }
      },
      extraVerification: (param) => {
        if (param.delay != 0)
          visualNovel.internalInfo.hasDelayedAnimation = true
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  scene.characters.push({ name: options.name, image: options.image, position: options.position, animations: options.animations })

  return scene
}

function addScenario(scene, options) {
  const checks = {
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    }
  }

  helper.verifyParams(checks, options)

  scene.background = options.image

  return scene
}

function addSpeech(scene, options) {
  const checks = {
    'author': {
      type: 'object',
      params: {
        'name': {
          type: 'string'
        },
        'textColor': {
          type: 'string'
        },
        'rectangle': {
          type: 'object',
          params: {
            'color': {
              type: 'string'
            },
            'opacity': {
              type: 'number'
            }
          }
        }
      }
    },
    'text': {
      type: 'object',
      params: {
        'content': {
          type: 'string'
        },
        'color': {
          type: 'string'
        },
        'fontSize': {
          type: 'number'
        },
        'rectangle': {
          type: 'object',
          params: {
            'color': {
              type: 'string'
            },
            'opacity': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  scene.speech = options
  scene.speech.text.content = JSON.stringify(options.text.content).slice(1, -1)

  visualNovel.internalInfo.hasSpeech = true

  return scene
}

function addSoundEffects(scene, options) {
  if (!Array.isArray(options))
    helper.logFatal('Sound effects must be an array.')

  const checks = {
    'sound': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'delay': {
      type: 'number',
      extraVerification: (param) => {
        if (param != 0)
          visualNovel.internalInfo.hasDelayedSoundEffect = true
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  scene.effect = options

  visualNovel.internalInfo.hasEffect = true

  return scene
}

function addMusic(scene, options) {
  const checks = {
    'music': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'delay': {
      type: 'number',
      extraVerification: (param) => {
        if (param != 0)
          visualNovel.internalInfo.hasDelayedMusic = true
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  scene.music = options

  visualNovel.internalInfo.hasSceneMusic = true

  return scene
}

function addTransition(scene, options) {
  const checks = {
    'duration': {
      type: 'number'
    }
  }

  helper.verifyParams(checks, options)

  scene.transition = options

  return scene
}

function setNextScene(scene, options) {
  const checks = {
    'scene': {
      type: 'string'
    }
  }

  helper.verifyParams(checks, options)

  scene.next = options.scene

  return scene
}

function addSubScenes(scene, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'scene': {
      type: 'string',
      extraVerification: (param) => {
        if (visualNovel.subScenes.find((subScene) => subScene.name == param))
          helper.logFatal('A sub-scene already exists with this name.')
      }
    }
  }

  helper.verifyParams(checks, options)

  scene.subScenes = options

  return scene
}

function addCustomText(scene, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'color': {
      type: 'string'
    },
    'fontSize': {
      type: 'number'
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  console.log('oof')
  
  helper.verifyParams(checks, options)

  scene.custom.push({
    type: 'text',
    ...options
  })

  return scene
}

function addCustomButton(scene, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'color': {
      type: 'string'
    },
    'fontSize': {
      type: 'number'
    },
    'height': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  scene.custom.push({
    type: 'button',
    ...options
  })

  return scene
}

function addCustomRectangle(scene, options) {
  const checks = {
    'color': {
      type: 'string'
    },
    'opacity': {
      type: 'number',
      min: 0,
      max: 1
    },
    'height': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  scene.custom.push({
    type: 'rectangle',
    ...options
  })

  return scene
}

function addCustomImage(scene, options) {
  const checks = {
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'height': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  scene.custom.push({
    type: 'image',
    ...options
  })

  return scene
}

function finalize(scene, options) {
  const checks = {
    'textColor': {
      type: 'string'
    },
    'backTextColor': {
      type: 'string'
    },
    'buttonsColor': {
      type: 'string'
    },
    'footerTextColor': {
      type: 'string'
    }
  }

  helper.verifyParams(checks, options)

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

  if (scene.subScenes.length == 2) {
    sceneCode += '    val buttonSubScenes = Button(this)' + '\n' +
                 `    buttonSubScenes.text = "${scene.subScenes[0].text}"` + '\n' +
                 '    buttonSubScenes.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._12ssp))' + '\n' +
                 `    buttonSubScenes.setTextColor(0xFF${options.buttonsColor}.toInt())` + '\n' +
                 '    buttonSubScenes.background = null' + '\n\n' +

                 '    val layoutParamsSubScenes = LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +

                 '    val topDpSubScenes = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._120sdp)' + '\n\n' +

                 '    layoutParamsSubScenes.gravity = Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsSubScenes.setMargins(0, topDpSubScenes, 0, 0)' + '\n\n' +

                 '    buttonSubScenes.layoutParams = layoutParamsSubScenes' + '\n\n'


    const functionParams = []
    if (scene.subScenes[0].speech && !scene.speech) functionParams.push('true')
    if (scene.subScenes[0].speech?.author?.name && scene.speech && !scene.speech?.author?.name && i + 1 != visualNovel.scenes.length - 1) functionParams.push('true')

    sceneCode += '    buttonSubScenes.setOnClickListener {' + '\n' +
                 '      __PERFORVNM_SUBSCENE_1__' + '\n' +
                 '    }' + '\n\n' +

                 '    frameLayout.addView(buttonSubScenes)' + '\n\n' +

                 '    val buttonSubScenes2 = Button(this)' + '\n' +
                 `    buttonSubScenes2.text = "${scene.subScenes[1].text}"` + '\n' +
                 '    buttonSubScenes2.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._12ssp))' + '\n' +
                 `    buttonSubScenes2.setTextColor(0xFF${options.buttonsColor}.toInt())` + '\n' +
                 '    buttonSubScenes2.background = null' + '\n\n' +

                 '    val layoutParamsSubScenes2 = LayoutParams(' + '\n' +
                 '      LayoutParams.WRAP_CONTENT,' + '\n' +
                 '      LayoutParams.WRAP_CONTENT' + '\n' +
                 '    )' + '\n\n' +

                 '    val topDpSubScenes2 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp)' + '\n\n' +

                 '    layoutParamsSubScenes2.gravity = Gravity.CENTER_HORIZONTAL' + '\n' +
                 '    layoutParamsSubScenes2.setMargins(0, topDpSubScenes2, 0, 0)' + '\n\n' +

                 '    buttonSubScenes2.layoutParams = layoutParamsSubScenes2' + '\n\n' +

                 '    buttonSubScenes2.setOnClickListener {' + '\n' +
                 '      __PERFORVNM_SUBSCENE_2__' + '\n' +
                 '    }' + '\n\n' +

                 '    frameLayout.addView(buttonSubScenes2)' + '\n\n'
  } else if (scene.subScenes.length != 0) {
    helper.logWarning('Unecessary sub-scenes, only 2 are allowed.', 'Android')
  }

  scene.custom.forEach((custom, index) => {
    switch (custom.type) {
      case 'text': {
        sceneCode += `    val textViewCustomText${index} = TextView(this)` + '\n' +
                     `    textViewCustomText${index}.text = "${custom.text}"` + '\n' +
                     `    textViewCustomText${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${custom.fontSize}ssp))` + '\n' +
                     `    textViewCustomText${index}.setTextColor(0xFF${custom.color}.toInt())` + '\n\n' +

                     `    val layoutParamsCustomText${index} = LayoutParams(` + '\n' +
                     '      LayoutParams.WRAP_CONTENT,' + '\n' +
                     '      LayoutParams.WRAP_CONTENT' + '\n' +
                     '    )' + '\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomText${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomText${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            sceneCode += definitions.join('\n') + '\n\n' +

                         `    layoutParamsCustomText${index}.gravity = Gravity.TOP or Gravity.START` + '\n' +
                         `    layoutParamsCustomText${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomText${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomText${index}` : '0'}, 0)` + '\n\n' +

                         `    textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}` + '\n\n' +

                         `    frameLayout.addView(textViewCustomText${index})` + '\n\n'

            break
          }
          case 'center': {
            sceneCode += `    layoutParamsCustomText${index}.gravity = Gravity.CENTER` + '\n\n' +

                         `    textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}` + '\n\n' +

                         `    frameLayout.addView(textViewCustomText${index})` + '\n\n'

            break
          }
        }

        break
      }
      case 'button': {
        sceneCode += `    val buttonCustomButton${index} = Button(this)` + '\n' +
                     `    buttonCustomButton${index}.text = "${custom.text}"` + '\n' +
                     `    buttonCustomButton${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${custom.fontSize}ssp))` + '\n' +
                     `    buttonCustomButton${index}.setTextColor(0xFF${custom.color}.toInt())` + '\n' +
                     '    buttonCustomButton${index}.background = null' + '\n\n' +

                     `    val layoutParamsCustomButton${index} = LayoutParams(` + '\n'

        switch (custom.height) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,' + '\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,' + '\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),` + '\n'
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,' + '\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,' + '\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),` + '\n'
          }
        }

        sceneCode += '    )' + '\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomButton${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomButton${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            sceneCode += definitions.join('\n') + '\n\n' +

                         `    layoutParamsCustomButton${index}.gravity = Gravity.TOP or Gravity.START` + '\n' +
                         `    layoutParamsCustomButton${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomButton${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomButton${index}` : '0'}, 0)` + '\n\n' +

                         `    buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}` + '\n\n' +

                         `    frameLayout.addView(buttonCustomButton${index})` + '\n\n'

            break
          }
          case 'center': {
            sceneCode += `    layoutParamsCustomButton${index}.gravity = Gravity.CENTER` + '\n\n' +

                         `    buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}` + '\n\n' +

                         `    frameLayout.addView(buttonCustomButton${index})` + '\n\n'

            break
          }
        }

        break
      }
      case 'rectangle': {
        sceneCode += `    val rectangleViewCustomRectangle${index} = RectangleView(this)` + '\n\n' +

                     `    val layoutParamsCustomRectangle${index} = LayoutParams(` + '\n'

        switch (custom.height) {
        case 'match': {
          sceneCode += '      LayoutParams.MATCH_PARENT,' + '\n'

          break
        }
        case 'wrap': {
          sceneCode += '      LayoutParams.WRAP_CONTENT,' + '\n'

          break
        }
        default: {
          sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),` + '\n'
        }
      }

      switch (custom.width) {
        case 'match': {
          sceneCode += '      LayoutParams.MATCH_PARENT,' + '\n'

          break
        }
        case 'wrap': {
          sceneCode += '      LayoutParams.WRAP_CONTENT,' + '\n'

          break
        }
        default: {
          sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),` + '\n'
        }
      }

        sceneCode += '    )' + '\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomRectangle${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomRectangle${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            sceneCode += definitions.join('\n') + '\n\n' +

                         `    layoutParamsCustomRectangle${index}.gravity = Gravity.TOP or Gravity.START` + '\n' +
                         `    layoutParamsCustomRectangle${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomRectangle${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomRectangle${index}` : '0'}, 0)` + '\n\n' +

                         `    rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}` + '\n\n' +

                         `    frameLayout.addView(rectangleViewCustomRectangle${index})` + '\n\n'

            break
          }
          case 'center': {
            sceneCode += `    layoutParamsCustomRectangle${index}.gravity = Gravity.CENTER` + '\n\n' +

                         `    rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}` + '\n\n' +

                         `    frameLayout.addView(rectangleViewCustomRectangle${index})` + '\n\n'

            break
          }
        }

        break
      }
      case 'image': {
        sceneCode += `    val imageViewCustomImage${index} = ImageView(this)` + '\n' +
                     `    imageViewCustomImage${index}.setImageResource(R.drawable.${custom.image})` + '\n\n' +

                     `    val layoutParamsCustomImage${index} = LayoutParams(` + '\n'

        switch (custom.height) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,' + '\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,' + '\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),` + '\n'
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,' + '\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,' + '\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),` + '\n'
          }
        }

        sceneCode += '    )' + '\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomImage${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomImage${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            sceneCode += definitions.join('\n') + '\n\n' +

                         `    layoutParamsCustomImage${index}.gravity = Gravity.TOP or Gravity.START` + '\n' +
                         `    layoutParamsCustomImage${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomImage${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomImage${index}` : '0'}, 0)` + '\n\n' +

                         `    imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}` + '\n\n' +

                         `    frameLayout.addView(imageViewCustomImage${index})` + '\n\n'

            break
          }
          case 'center': {
            sceneCode += `    layoutParamsCustomImage${index}.gravity = Gravity.CENTER` + '\n\n' +

                         `    imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}` + '\n\n' +

                         `    frameLayout.addView(imageViewCustomImage${index})` + '\n\n'

            break
          }
        }

        break
      }
    }
  })

  if (scene.type == 'normal') {
    sceneCode += `    setContentView(frameLayout)__PERFORVNM_SCENE_${scene.name.toUpperCase()}__` + '\n' +
                 '  }'
  } else {
    if (scene.next) {
      sceneCode += '    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {' + '\n' +
                   '      ' + scene.next + '(__PERFORVNM_NEXT_SCENE_PARAMS__)' + '\n' +
                   '    }' + '\n\n' +

                   '    setContentView(frameLayout)' + '\n' +
                   '  }'
    } else {
      sceneCode += '    setContentView(frameLayout)' + '\n' +
                   '  }'
    }
  }

  if (scene.type == 'normal') visualNovel.scenes.push({ ...scene, code: sceneCode })
  else visualNovel.subScenes.push({ ...scene, code: sceneCode })

  helper.logOk(`Scene "${scene.name}" coded.`, 'Android')
}

export default {
  init,
  addCharacter,
  addScenario,
  addSpeech,
  addSoundEffects,
  addMusic,
  addTransition,
  setNextScene,
  addSubScenes,
  addCustomText,
  addCustomButton,
  addCustomRectangle,
  addCustomImage,
  finalize
}
