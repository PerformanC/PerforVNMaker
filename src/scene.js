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
    },
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

  return {
    name: options.name,
    type: 'normal',
    options: {
      textColor: options.textColor,
      backTextColor: options.backTextColor,
      buttonsColor: options.buttonsColor,
      footerTextColor: options.footerTextColor
    },
    next: null,
    characters: [],
    subScenes: [],
    background: null,
    speech: null,
    effect: null,
    music: null,
    transition: null,
    custom: []
  }
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
            return additionalinfo.parent[additionalinfo.index].type == 'movement'
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
            return additionalinfo.parent[additionalinfo.index].type == 'movement'
          },
          required: false
        },
        'degrees': {
          type: 'number',
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type == 'rotate'
          }
        },
        'scale': {
          type: 'number',
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type == 'scale'
          }
        },
        'duration': {
          type: 'number',
          shouldCheck: (param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type != 'jump'
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
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
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
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
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
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
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

function finalize(scene) {
  let sceneCode = helper.codePrepare(`
    private fun ${scene.name}(__PERFORVNM_SCENE_PARAMS__) {
      val frameLayout = FrameLayout(this)
      frameLayout.setBackgroundColor(0xFF000000.toInt())\n\n`, 2, true
  )

  if ((scene.characters.length != 0 || scene.background != '') && scene.transition) {
    sceneCode += helper.codePrepare(`
      val animationFadeIn = AlphaAnimation(0f, 1f)
      animationFadeIn.duration = ${scene.transition.duration}
      animationFadeIn.interpolator = LinearInterpolator()
      animationFadeIn.fillAfter = true\n\n`, 2, true
    )
  }

  if (scene.background != '') {
    sceneCode += helper.codePrepare(`
      val imageView_scenario = ImageView(this)
      imageView_scenario.setImageResource(R.raw.${scene.background})
      imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView_scenario)\n\n`, 2, true
    )

    if (scene.transition)
      sceneCode += '    imageView_scenario.startAnimation(animationFadeIn)' + '\n\n'
  }

  for (let character of scene.characters) {
    switch (character.position.side) {
      case 'center': {
        sceneCode += helper.codePrepare(`
          val imageView_${character.name} = ImageView(this)
          imageView_${character.name}.setImageResource(R.raw.${character.image})
          imageView_${character.name}.scaleType = ImageView.ScaleType.FIT_CENTER\n\n`, 6, true
        )

        if (character.animations) {
          sceneCode += helper.codePrepare(`
            val layoutParams_${character.name} = LayoutParams(
              LayoutParams.WRAP_CONTENT,
              LayoutParams.WRAP_CONTENT
            )

            layoutParams_${character.name}.gravity = Gravity.CENTER

            imageView_${character.name}.layoutParams = layoutParams_${character.name}\n\n`, 8, true
          )
        }

        sceneCode += `    frameLayout.addView(imageView_${character.name})` + '\n'

        break
      }
      case 'right':
      case 'left': {
        let dpiFunctions = ''
        if (character.position.margins.side != 0) {
          dpiFunctions += `    val ${character.position.side}Dp_${character.name} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${character.position.margins.side}sdp)\n`
        }

        if (character.position.margins.top != 0) {
          dpiFunctions += `    val topDp_${character.name} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${character.position.margins.top}sdp)\n`
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

        sceneCode += helper.codePrepare(`
          val imageView_${character.name} = ImageView(this)
          imageView_${character.name}.setImageResource(R.raw.${character.image})
          imageView_${character.name}.scaleType = ImageView.ScaleType.FIT_CENTER

          val layoutParams_${character.name} = LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
          )\n\n`, 6, true
        ) +

        dpiFunctions +

        `    layoutParams_${character.name}.gravity = Gravity.CENTER` + '\n' +

        layoutParams + '\n\n' +

        helper.codePrepare(`
          imageView_${character.name}.layoutParams = layoutParams_${character.name}

          frameLayout.addView(imageView_${character.name})\n`, 6, true
        )

        break
      }
    }

    let SPACE = '    '
    const finalCode = []

    if (scene.animations) {
      SPACE += '    '

      sceneCode += helper.codePrepare(`
        imageView_${character.name}.startAnimation(animationFadeIn)

        animationFadeIn.setAnimationListener(object : Animation.AnimationListener {
          override fun onAnimationStart(animation: Animation?) {}

          override fun onAnimationEnd(animation: Animation?) {`, 4, false
      ) +

      finalCode.push(
        helper.codePrepare(`
            }

            override fun onAnimationRepeat(animation: Animation?) {}
          })\n`, 4, true
        )
      )
    }

    let i = 0

    if (character.animations) for (let animation of character.animations) {
      if (animation.delay != 0) {
        sceneCode += helper.codePrepare(`
          ${SPACE}handler.postDelayed(object : Runnable {
          ${SPACE}  override fun run() {\n`, 10, true
        )

        finalCode.push(
          helper.codePrepare(`
            ${SPACE}  }
            ${SPACE}}, ${animation.delay})\n`, 12, true
          )
        )

        SPACE += '    '
      }

      if (animation.type == 'jump') {
        sceneCode += helper.codePrepare(`
          ${SPACE}imageView_${character.name}.animate()
          ${SPACE}  .translationY(${animation.margins.top}f)
          ${SPACE}  .setDuration(${animation.duration / 2})
          ${SPACE}  .setInterpolator(OvershootInterpolator())
          ${SPACE}  .setListener(object : Animator.AnimatorListener {
          ${SPACE}    override fun onAnimationStart(animation: Animator) {}

          ${SPACE}    override fun onAnimationEnd(animation: Animator) {
          ${SPACE}      imageView_${character.name}.animate()
          ${SPACE}        .translationY(0f)
          ${SPACE}        .setDuration(${animation.duration / 2})
          ${SPACE}        .setInterpolator(OvershootInterpolator())\n`, 10, true
        )

        finalCode.push(
          helper.codePrepare(`
            ${SPACE}    }

            ${SPACE}    override fun onAnimationCancel(animation: Animator) {}

            ${SPACE}    override fun onAnimationRepeat(animation: Animator) {}
            ${SPACE}  })\n`, 12, true
          )
        )

        SPACE += '      '
      } else {
        sceneCode += SPACE + `imageView_${character.name}.animate()` + '\n'

        switch (animation.type) {
          case 'movement': {
            sceneCode += helper.codePrepare(`
              ${SPACE}  .translationX(${(animation.side == 'center' ? '((frameLayout.width - imageView_' + character.name + '.width) / 2).toFloat()' : animation.margins.side)}f)
              ${SPACE}  .translationY(${(animation.side == 'center' ? '((frameLayout.height - imageView_' + character.name + '.height) / 2).toFloat()' : animation.margins.top)}f)\n`, 14, true
            )

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
            sceneCode += helper.codePrepare(`
              ${SPACE}  .scaleX(${animation.scale}f)
              ${SPACE}  .scaleY(${animation.scale}f)\n`, 14, true
            )

            break
          }
        }

        sceneCode += helper.codePrepare(`
          ${SPACE}  .setDuration(${animation.duration})
          ${SPACE}  .setInterpolator(LinearInterpolator())\n`, 10, true
        )
      }

      if (character.animations.length - 1 == i) {
        sceneCode += SPACE + '  .start()' + '\n'
      } else {
        sceneCode += helper.codePrepare(`
          ${SPACE}  .setListener(object : Animator.AnimatorListener {
          ${SPACE}    override fun onAnimationStart(animation: Animator) {}

          ${SPACE}    override fun onAnimationEnd(animation: Animator) {\n`, 10, true
        )

        finalCode.push(
          helper.codePrepare(`
            ${SPACE}    }

            ${SPACE}    override fun onAnimationCancel(animation: Animator) {}

            ${SPACE}    override fun onAnimationRepeat(animation: Animator) {}
            ${SPACE}  })
            ${SPACE}  .start()\n`, 12, true
          )
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
    sceneCode += helper.codePrepare(`
      val rectangleViewSpeech = RectangleView(this)

      val bottomDpRectangles = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

      val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, bottomDpRectangles)
      layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech\n`, 2, false
    )

    if (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += `    rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)\n`
    }

    sceneCode += `    rectangleViewSpeech.setColor(0xFF${scene.speech.text.rectangle.color}.toInt())\n`

    if (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += helper.codePrepare(`
        if (animate) {
          val animationRectangleSpeech = AlphaAnimation(0f, ${scene.speech.text.rectangle.opacity}f)
          animationRectangleSpeech.duration = 1000
          animationRectangleSpeech.interpolator = LinearInterpolator()
          animationRectangleSpeech.fillAfter = true

          rectangleViewSpeech.startAnimation(animationRectangleSpeech)
        } else {
          rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)
        }\n\n`, 4, false
      )
    } else {
      sceneCode += '\n'
    }

    sceneCode += helper.codePrepare(`
      frameLayout.addView(rectangleViewSpeech)

      val textViewSpeech = TextView(this)
      textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${scene.speech.text.fontSize}ssp))
      textViewSpeech.setTextColor(0xFF${scene.speech.text.color}.toInt())

      val layoutParamsSpeech = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
      layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)

      textViewSpeech.layoutParams = layoutParamsSpeech

      var speechText = "${scene.speech.text.content}"__PERFORVNM_SPEECH_HANDLER__
      frameLayout.addView(textViewSpeech)

      val rectangleViewAuthor = RectangleView(this)

      val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
      layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
      layoutParamsRectangleAuthor.setMargins(0, 0, 0, bottomDpRectangles)

      rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor\n`, 2, true
    )

    if (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += `    rectangleViewAuthor.setAlpha(${scene.speech.author.rectangle.opacity}f)\n`
    }

    sceneCode += `    rectangleViewAuthor.setColor(0xFF${scene.speech.author.rectangle.color}.toInt())\n\n`

    if (visualNovel.scenes.length == 0 || !visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += helper.codePrepare(`
        if (animate) {
          val animationRectangleAuthor = AlphaAnimation(0f, ${scene.speech.author.rectangle.opacity}f)
          animationRectangleAuthor.duration = 1000
          animationRectangleAuthor.interpolator = LinearInterpolator()
          animationRectangleAuthor.fillAfter = true

          rectangleViewAuthor.startAnimation(animationRectangleAuthor)
        } else {
          rectangleViewAuthor.setAlpha(${scene.speech.author.rectangle.opacity}f)
        }\n\n`, 4, true
      )
    }

    sceneCode += '    frameLayout.addView(rectangleViewAuthor)'

    if (scene.speech.author.name) {
      sceneCode += helper.codePrepare(`

        val textViewAuthor = TextView(this)
        textViewAuthor.text = "${scene.speech.author.name}"
        textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
        textViewAuthor.setTextColor(0xFF${scene.speech.author.textColor}.toInt())

        val layoutParamsAuthor = LayoutParams(
          LayoutParams.WRAP_CONTENT,
          LayoutParams.WRAP_CONTENT
        )

        layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
        layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, bottomDpRectangles)

        textViewAuthor.layoutParams = layoutParamsAuthor\n\n`, 4, false
      )

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

          sceneCode += helper.codePrepare(`
              val animationAuthor = AlphaAnimation(0f, 1f)
              animationAuthor.duration = 1000
              animationAuthor.interpolator = LinearInterpolator()
              animationAuthor.fillAfter = true

              textViewAuthor.startAnimation(animationAuthor)
            }\n\n`, 8, false
          )
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

        sceneCode += helper.codePrepare(`
          handler.postDelayed(object : Runnable {
            override fun run() {\n`, 6, false
        )

        finalCode.push(
          helper.codePrepare(`
              }
            }, ${scene.music.delay})\n`, 6, true
          )
        )
      } else {
        sceneCode += '\n'
      }

      sceneCode += helper.codePrepare(`
        ${SPACE}mediaPlayer = MediaPlayer.create(this, R.raw.${scene.music.music})

        ${SPACE}if (mediaPlayer != null) {
        ${SPACE}  mediaPlayer!!.start()

        ${SPACE}  mediaPlayer!!.setVolume(musicVolume, musicVolume)

        ${SPACE}  mediaPlayer!!.setOnCompletionListener {
        ${SPACE}    if (mediaPlayer != null) {
        ${SPACE}      mediaPlayer!!.stop()
        ${SPACE}      mediaPlayer!!.release()
        ${SPACE}      mediaPlayer = null
        ${SPACE}    }
        ${SPACE}  }
        ${SPACE}}\n`, 8, true
      )

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

        sceneCode += helper.codePrepare(`
          handler.postDelayed(object : Runnable {
            override fun run() {\n`, 6, false
        )

        finalCode.push(
          helper.codePrepare(`
              }
            }, ${effect.delay}L)\n`, 6, true
          )
        )
      } else {
        sceneCode += '\n'
      }

      let mediaPlayerName = 'mediaPlayer'
      if (scene.music) mediaPlayerName = 'mediaPlayer2'

      sceneCode += helper.codePrepare(`
        ${SPACE}${mediaPlayerName} = MediaPlayer.create(this@MainActivity, R.raw.${effect.sound})

        ${SPACE}if (${mediaPlayerName} != null) {
        ${SPACE}  ${mediaPlayerName}!!.start()

        ${SPACE}  ${mediaPlayerName}!!.setVolume(sEffectVolume, sEffectVolume)

        ${SPACE}  ${mediaPlayerName}!!.setOnCompletionListener {
        ${SPACE}    if (${mediaPlayerName} != null) {
        ${SPACE}      ${mediaPlayerName}!!.stop()
        ${SPACE}      ${mediaPlayerName}!!.release()
        ${SPACE}      ${mediaPlayerName} = null
        ${SPACE}    }
        ${SPACE}  }
        ${SPACE}}\n`, 8, true
      )

      if (finalCode.length != 0) {
        finalCode.reverse()

        sceneCode += finalCode.join('')
      }
    }
  }

  const finishScene = []

  if ((scene.effect && !scene.music) || (scene.effect && scene.music)) {
    finishScene.push(
      helper.codePrepare(`
        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }`, 2, true
      )
    )
  }

  if (scene.effect && scene.music) {
    finishScene.push(
      helper.codePrepare(`
        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }`, 2, true
      )
    )

    finishScene.push(
      helper.codePrepare(`
        if (mediaPlayer2 != null) {
          mediaPlayer2!!.stop()
          mediaPlayer2!!.release()
          mediaPlayer2 = null
        }`, 2, true
      )
    )
  }

  if (scene.speech || (scene.effect && scene.effect.delay != 0) || (scene.music && scene.music.delay != 0))
    finishScene.push('      handler.removeCallbacksAndMessages(null)')

  finishScene.push('      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)')

  sceneCode += helper.codePrepare(`
    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonSave.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(leftDpButtons, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()\n\n`, 0, false
  )

  const sceneJson = {}

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

  sceneCode += 
    `      val newSave = "${JSON.stringify(JSON.stringify(sceneJson)).slice(1, -2)},\\"history\\":" + scenesToJson() + "}"\n\n` +

    helper.codePrepare(`
        if (saves == "[]") saves = "[" + newSave + "]"
        else saves = saves.dropLast(1) + "," + newSave + "]"

        val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
        outputStream.write(saves.toByteArray())
        outputStream.close()
      }

      frameLayout.addView(buttonSave)

      val buttonMenu = Button(this)
      buttonMenu.text = "Menu"
      buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
      buttonMenu.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonMenu.background = null

      val layoutParamsMenu = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val topDpMenu = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp)

      layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
      layoutParamsMenu.setMargins(leftDpButtons, topDpMenu, 0, 0)

      buttonMenu.layoutParams = layoutParamsMenu\n\n`, 2, true
  )

  if (finishScene.length != 0) {
    sceneCode += '    buttonMenu.setOnClickListener {\n' +
                 finishScene.join('\n\n') + '\n' +
                 '__PERFORVNM_START_MUSIC__\n\n'
  } else {
    sceneCode += '    buttonMenu.setOnClickListener {__PERFORVNM_START_MUSIC__' + '\n\n'
  }

  sceneCode += helper.codePrepare(`
      ${(visualNovel.menu ? visualNovel.menu.name : '__PERFORVNM_MENU__')}
    }

    frameLayout.addView(buttonMenu)\n\n`, 0, true
  )

  if (visualNovel.scenes.length != 0) {
    sceneCode += helper.codePrepare(`
      val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
      buttonBack.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val topDpBack = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp)

      layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(leftDpButtons, topDpBack, 0, 0)

      buttonBack.layoutParams = layoutParamsBack\n\n`, 2, true
    )

    if (finishScene.length != 0) {
      sceneCode += '    buttonBack.setOnClickListener {\n' +
                   finishScene.join('\n\n') + '\n\n'
    } else {
      sceneCode += '    buttonBack.setOnClickListener {\n'
    }

    if (visualNovel.subScenes.find((subScene) => subScene.next == scene.name)) {
      sceneCode += helper.codePrepare(`
        val scene = scenes.get(scenesLength - 1)

        scenesLength--
        scenes.set(scenesLength, "")

        switchScene(scene)\n`, 2, true
      )
    } else {
      if (visualNovel.scenes.length == 1) {
        sceneCode += `      ${visualNovel.scenes[visualNovel.scenes.length - 1].name}(${(visualNovel.scenes[visualNovel.scenes.length - 1].speech ? 'false' : '' )})` + '\n'
      } else {
        sceneCode += helper.codePrepare(`
          scenesLength--
          scenes.set(scenesLength, "")

          ${visualNovel.scenes[visualNovel.scenes.length - 1].name}(${(visualNovel.scenes[visualNovel.scenes.length - 1].speech ? 'false' : '' )})\n`, 4, true
        )
      }
    }

    sceneCode += helper.codePrepare(`
      }

      frameLayout.addView(buttonBack)\n\n`, 2, true
    )
  }

  if (scene.subScenes.length == 2) {
    sceneCode += helper.codePrepare(`
      val buttonSubScenes = Button(this)
      buttonSubScenes.text = "${scene.subScenes[0].text}"
      buttonSubScenes.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._12ssp))
      buttonSubScenes.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonSubScenes.background = null

      val layoutParamsSubScenes = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val topDpSubScenes = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._120sdp)

      layoutParamsSubScenes.gravity = Gravity.CENTER_HORIZONTAL
      layoutParamsSubScenes.setMargins(0, topDpSubScenes, 0, 0)

      buttonSubScenes.layoutParams = layoutParamsSubScenes\n\n`, 2, true
    )

    const functionParams = []
    if (scene.subScenes[0].speech && !scene.speech) functionParams.push('true')
    if (scene.subScenes[0].speech?.author?.name && scene.speech && !scene.speech?.author?.name && i + 1 != visualNovel.scenes.length - 1) functionParams.push('true')

    sceneCode += helper.codePrepare(`
      buttonSubScenes.setOnClickListener {
        __PERFORVNM_SUBSCENE_1__
      }

      frameLayout.addView(buttonSubScenes)

      val buttonSubScenes2 = Button(this)
      buttonSubScenes2.text = "${scene.subScenes[1].text}"
      buttonSubScenes2.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._12ssp))
      buttonSubScenes2.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonSubScenes2.background = null

      val layoutParamsSubScenes2 = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val topDpSubScenes2 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp)

      layoutParamsSubScenes2.gravity = Gravity.CENTER_HORIZONTAL
      layoutParamsSubScenes2.setMargins(0, topDpSubScenes2, 0, 0)

      buttonSubScenes2.layoutParams = layoutParamsSubScenes2

      buttonSubScenes2.setOnClickListener {
        __PERFORVNM_SUBSCENE_2__
      }

      frameLayout.addView(buttonSubScenes2)\n\n`, 2, true
    )
  } else if (scene.subScenes.length != 0) {
    helper.logWarning('Unecessary sub-scenes, only 2 are allowed.', 'Android')
  }

  scene.custom.forEach((custom, index) => {
    switch (custom.type) {
      case 'text': {
        sceneCode += helper.codePrepare(`
          val textViewCustomText${index} = TextView(this)
          textViewCustomText${index}.text = "${custom.text}"
          textViewCustomText${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${custom.fontSize}ssp))
          textViewCustomText${index}.setTextColor(0xFF${custom.color}.toInt())

          val layoutParamsCustomText${index} = LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
          )\n\n`, 8, true
        )

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

            sceneCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomText${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomText${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomText${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomText${index}` : '0'}, 0)

                textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

                frameLayout.addView(textViewCustomText${index})\n\n`, 12, true
              )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomText${index}.gravity = Gravity.CENTER

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 12, true
            )

            break
          }
        }

        break
      }
      case 'button': {
        sceneCode += helper.codePrepare(`
          val buttonCustomButton${index} = Button(this)
          buttonCustomButton${index}.text = "${custom.text}"
          buttonCustomButton${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${custom.fontSize}ssp))
          buttonCustomButton${index}.setTextColor(0xFF${custom.color}.toInt())
          buttonCustomButton${index}.background = null

          val layoutParamsCustomButton${index} = LayoutParams(\n`, 6, true
        )

        switch (custom.height) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),\n`
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),\n`
          }
        }

        sceneCode += '    )\n\n'

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

            sceneCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomButton${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomButton${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomButton${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomButton${index}` : '0'}, 0)

                buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

                frameLayout.addView(buttonCustomButton${index})\n\n`, 12, true
              )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomButton${index}.gravity = Gravity.CENTER

              buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

              frameLayout.addView(buttonCustomButton${index})\n\n`, 10, true
            )

            break
          }
        }

        break
      }
      case 'rectangle': {
        sceneCode += helper.codePrepare(`
          val rectangleViewCustomRectangle${index} = RectangleView(this)

          val layoutParamsCustomRectangle${index} = LayoutParams(\n`, 6, true
        )

        switch (custom.height) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),\n`
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),\n`
          }
        }

        sceneCode += '    )\n\n'

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

            sceneCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomRectangle${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomRectangle${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomRectangle${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomRectangle${index}` : '0'}, 0)

                rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

                frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 12, true
              )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomRectangle${index}.gravity = Gravity.CENTER

              rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

              frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 10, true
            )

            break
          }
        }

        break
      }
      case 'image': {
        sceneCode += helper.codePrepare(`
          val imageViewCustomImage${index} = ImageView(this)
          imageViewCustomImage${index}.setImageResource(R.drawable.${custom.image})

          val layoutParamsCustomImage${index} = LayoutParams(\n`, 6, true
        )

        switch (custom.height) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),\n`
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            sceneCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            sceneCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),\n`
          }
        }

        sceneCode += '    )\n\n'

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

            sceneCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomImage${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomImage${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomImage${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomImage${index}` : '0'}, 0)

                imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

                frameLayout.addView(imageViewCustomImage${index})\n\n`, 12, true
              )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomImage${index}.gravity = Gravity.CENTER

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})`, 10, true
            )

            break
          }
        }

        break
      }
    }
  })

  if (scene.type == 'normal') {
    sceneCode += helper.codePrepare(`
        setContentView(frameLayout)__PERFORVNM_SCENE_${scene.name.toUpperCase()}__
      }`, 4, true
    )
  } else {
    if (scene.next) {
      sceneCode += helper.codePrepare(`
          findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
            scenes.set(scenesLength, "${scene.name}")
            scenesLength++

            ${scene.next}(__PERFORVNM_NEXT_SCENE_PARAMS__)
          }

          setContentView(frameLayout)
        }`, 6, true
      )
    } else {
      sceneCode += helper.codePrepare(`
          setContentView(frameLayout)
        }`, 6, true
      )
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
