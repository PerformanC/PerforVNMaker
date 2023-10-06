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
    custom: [],
    resources: []
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
      frameLayout.setBackgroundColor(0xFF000000.toInt())\n\n`, 2
  )

  if ((scene.characters.length != 0 || scene.background != '') && scene.transition) {
    sceneCode += helper.codePrepare(`
      val animationFadeIn = AlphaAnimation(0f, 1f)
      animationFadeIn.duration = ${scene.transition.duration}
      animationFadeIn.interpolator = LinearInterpolator()
      animationFadeIn.fillAfter = true\n\n`, 2
    )
  }

  if (scene.background != '') {
    sceneCode += helper.codePrepare(`
      val imageView_scenario = ImageView(this)
      imageView_scenario.setImageResource(R.raw.${scene.background})
      imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView_scenario)\n\n`, 2
    )

    if (scene.transition)
      sceneCode += helper.codePrepare('imageView_scenario.startAnimation(animationFadeIn)\n\n', 0, 4, false)
  }

  for (let character of scene.characters) {
    switch (character.position.side) {
      case 'center': {
        sceneCode += helper.codePrepare(`
          val imageView_${character.name} = ImageView(this)
          imageView_${character.name}.setImageResource(R.raw.${character.image})
          imageView_${character.name}.scaleType = ImageView.ScaleType.FIT_CENTER\n\n`, 6
        )

        if (character.animations) {
          sceneCode += helper.codePrepare(`
            val layoutParams_${character.name} = LayoutParams(
              LayoutParams.WRAP_CONTENT,
              LayoutParams.WRAP_CONTENT
            )

            layoutParams_${character.name}.gravity = Gravity.CENTER

            imageView_${character.name}.layoutParams = layoutParams_${character.name}\n\n`, 8,
          )
        }

        sceneCode += helper.codePrepare(`frameLayout.addView(imageView_${character.name})\n`, 0, 4, false)

        break
      }
      case 'right':
      case 'left': {
        let definitions = ''

        let marginSideSdp = null
        if (character.position.margins.side != 0) {
          marginSideSdp = helper.getResource(scene, { type: 'sdp', dp: character.position.margins.side })
          scene = helper.addResource(scene, { type: 'sdp', dp: character.position.margins.side, spaces: 4 })

          if (marginSideSdp.definition) definitions += marginSideSdp.definition
        }

        let marginTopSdp = null
        if (character.position.margins.top != 0) {
          marginTopSdp = helper.getResource(scene, { type: 'sdp', dp: character.position.margins.top })
          scene = helper.addResource(scene, { type: 'sdp', dp: character.position.margins.top, spaces: 4 })

          if (marginTopSdp.definition) definitions += marginTopSdp.definition
        }

        let layoutParams = helper.codePrepare(`layoutParams_${character.name}.setMargins(`, 0, 4, false)
        if (character.position.margins.side != 0 && character.position.side == 'left') {
          layoutParams += `${marginSideSdp.variable}, `
        } else {
          layoutParams += '0, '
        }

        if (character.position.margins.top != 0) {
          layoutParams += `${marginTopSdp.variable}, `
        } else {
          layoutParams += '0, '
        }

        if (character.position.margins.side != 0 && character.position.side == 'right') {
          layoutParams += `${marginSideSdp.variable}, `
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
          )\n\n`, 6
        ) +

        definitions +

        helper.codePrepare(`layoutParams_${character.name}.gravity = Gravity.CENTER\n`, 0, 4, false) +

        layoutParams + '\n\n' +

        helper.codePrepare(`
          imageView_${character.name}.layoutParams = layoutParams_${character.name}

          frameLayout.addView(imageView_${character.name})\n`, 6
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

          override fun onAnimationEnd(animation: Animation?) {`, 4, 0, false
      ) +

      finalCode.push(
        helper.codePrepare(`
            }

            override fun onAnimationRepeat(animation: Animation?) {}
          })\n`, 4
        )
      )
    }

    let i = 0

    if (character.animations) for (let animation of character.animations) {
      if (animation.delay != 0) {
        sceneCode += helper.codePrepare(`
          ${SPACE}handler.postDelayed(object : Runnable {
          ${SPACE}  override fun run() {\n`, 10
        )

        finalCode.push(
          helper.codePrepare(`
            ${SPACE}  }
            ${SPACE}}, ${animation.delay})\n`, 12
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
          ${SPACE}        .setInterpolator(OvershootInterpolator())\n`, 10
        )

        finalCode.push(
          helper.codePrepare(`
            ${SPACE}  }

            ${SPACE}  override fun onAnimationCancel(animation: Animator) {}

            ${SPACE}  override fun onAnimationRepeat(animation: Animator) {}
            ${SPACE}})\n`, 10
          )
        )

        SPACE += '      '
      } else {
        sceneCode += helper.codePrepare(SPACE + `imageView_${character.name}.animate()\n`, 0, 0, false)

        switch (animation.type) {
          case 'movement': {
            sceneCode += helper.codePrepare(`
              ${SPACE}.translationX(${(animation.side == 'center' ? `((frameLayout.width - imageView_${character.name}.width) / 2).toFloat()` : animation.margins.side)}f)
              ${SPACE}.translationY(${(animation.side == 'center' ? `((frameLayout.height - imageView_${character.name}.height) / 2).toFloat()` : animation.margins.top)}f)\n`, 12
            )

            break
          }
          case 'fadeIn':
          case 'fadeOut': {
            sceneCode += helper.codePrepare(`${SPACE}.alpha(${(animation.type == 'fadeIn' ? 1 : 0)}f)\n`, 0, 2, false)

            break
          }
          case 'rotate': {
            sceneCode += helper.codePrepare(`${SPACE}.rotation(${animation.degrees}f)\n`, 0, 2, false)

            break
          }
          case 'scale': {
            sceneCode += helper.codePrepare(`
              ${SPACE}.scaleX(${animation.scale}f)
              ${SPACE}.scaleY(${animation.scale}f)\n`, 12
            )

            break
          }
        }

        sceneCode += helper.codePrepare(`
          ${SPACE}  .setDuration(${animation.duration})
          ${SPACE}  .setInterpolator(LinearInterpolator())\n`, 10
        )
      }

      if (character.animations.length - 1 == i) {
        sceneCode += helper.codePrepare(`${SPACE}.start()\n`, 0, 2, false)
      } else {
        sceneCode += helper.codePrepare(`
          ${SPACE}.setListener(object : Animator.AnimatorListener {
          ${SPACE}  override fun onAnimationStart(animation: Animator) {}

          ${SPACE}  override fun onAnimationEnd(animation: Animator) {\n`, 8
        )

        finalCode.push(
          helper.codePrepare(`
            ${SPACE}  }

            ${SPACE}  override fun onAnimationCancel(animation: Animator) {}

            ${SPACE}  override fun onAnimationRepeat(animation: Animator) {}
            ${SPACE}})
            ${SPACE}.start()\n`, 10
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

  let sdp53 = null

  if (scene.speech) {
    sdp53 = helper.getResource(scene, { type: 'sdp', dp: '53' })
    scene = helper.addResource(scene, { type: 'sdp', dp: '53', spaces: 4 })

    sceneCode += helper.codePrepare(`
      val rectangleViewSpeech = RectangleView(this)

      ${sdp53.definition}val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, ${sdp53.variable})
      layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech\n`, 2, 0, false
    )

    if (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += helper.codePrepare(`rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)\n`, 0, 4, false)
    }

    sceneCode += helper.codePrepare(`rectangleViewSpeech.setColor(0xFF${scene.speech.text.rectangle.color}.toInt())\n`, 0, 4, false)

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
        }\n\n`, 4, 0, false
      )
    } else {
      sceneCode += '\n'
    }

    const speechTextSsp = helper.getResource(scene, { type: 'ssp', dp: scene.speech.text.fontSize })
    scene = helper.addResource(scene, { type: 'ssp', dp: scene.speech.text.fontSize, spaces: 4 })

    const sdp270 = helper.getResource(scene, { type: 'sdp', dp: '270' })
    scene = helper.addResource(scene, { type: 'sdp', dp: '270', spaces: 4 })

    sceneCode += helper.codePrepare(`
      frameLayout.addView(rectangleViewSpeech)

      ${speechTextSsp.definition}val textViewSpeech = TextView(this)
      textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${speechTextSsp.variable})
      textViewSpeech.setTextColor(0xFF${scene.speech.text.color}.toInt())

      val layoutParamsSpeech = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp270.definition}layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
      layoutParamsSpeech.setMargins(0, ${sdp270.variable}, 0, 0)

      textViewSpeech.layoutParams = layoutParamsSpeech

      var speechText = "${scene.speech.text.content}"__PERFORVNM_SPEECH_HANDLER__
      frameLayout.addView(textViewSpeech)

      val rectangleViewAuthor = RectangleView(this)

      val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
      layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
      layoutParamsRectangleAuthor.setMargins(0, 0, 0, ${sdp53.variable})

      rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor\n`, 2
    )

    if (visualNovel.scenes.length != 0 && visualNovel.scenes[visualNovel.scenes.length - 1].speech) {
      sceneCode += helper.codePrepare(`rectangleViewAuthor.setAlpha(${scene.speech.author.rectangle.opacity}f)\n`, 0, 4, false)
    }

    sceneCode += helper.codePrepare(`rectangleViewAuthor.setColor(0xFF${scene.speech.author.rectangle.color}.toInt())\n\n`, 0, 4, false)

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
        }\n\n`, 4
      )
    }

    sceneCode += helper.codePrepare('frameLayout.addView(rectangleViewAuthor)', 0, 4, false)

    if (scene.speech.author.name) {
      const authorTextSsp = helper.getResource(scene, { type: 'ssp', dp: '13' })
      scene = helper.addResource(scene, { type: 'ssp', dp: '13', spaces: 4 })

      const sdp135 = helper.getResource(scene, { type: 'sdp', dp: '155' })
      scene = helper.addResource(scene, { type: 'sdp', dp: '155', spaces: 4 })

      sceneCode += helper.codePrepare(`

        ${authorTextSsp.definition}val textViewAuthor = TextView(this)
        textViewAuthor.text = "${scene.speech.author.name}"
        textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${authorTextSsp.variable})
        textViewAuthor.setTextColor(0xFF${scene.speech.author.textColor}.toInt())

        val layoutParamsAuthor = LayoutParams(
          LayoutParams.WRAP_CONTENT,
          LayoutParams.WRAP_CONTENT
        )

        ${sdp135.definition}layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
        layoutParamsAuthor.setMargins(${sdp135.variable}, 0, 0, ${sdp53.variable})

        textViewAuthor.layoutParams = layoutParamsAuthor\n\n`, 4, 0, false
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
            sceneCode += helper.codePrepare('if (animateAuthor) {', 0, 4, false)
          } else {
            sceneCode += helper.codePrepare('if (animate) {', 0, 4, false)
          }

          sceneCode += helper.codePrepare(`
              val animationAuthor = AlphaAnimation(0f, 1f)
              animationAuthor.duration = 1000
              animationAuthor.interpolator = LinearInterpolator()
              animationAuthor.fillAfter = true

              textViewAuthor.startAnimation(animationAuthor)
            }\n\n`, 8, 0, false
          )
      }


      sceneCode += helper.codePrepare('frameLayout.addView(textViewAuthor)', 0, 4, false)
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
            override fun run() {\n`, 6, 0, false
        )

        finalCode.push(
          helper.codePrepare(`
              }
            }, ${scene.music.delay})\n`, 6
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
        ${SPACE}}\n`, 8
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
            override fun run() {\n`, 6, 0, false
        )

        finalCode.push(
          helper.codePrepare(`
              }
            }, ${effect.delay}L)\n`, 6
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
        ${SPACE}}\n`, 8
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
        }`
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
        }`
      )
    )

    finishScene.push(
      helper.codePrepare(`
        if (mediaPlayer2 != null) {
          mediaPlayer2!!.stop()
          mediaPlayer2!!.release()
          mediaPlayer2 = null
        }`
      )
    )
  }

  if (scene.speech || (scene.effect && scene.effect.delay != 0) || (scene.music && scene.music.delay != 0))
    finishScene.push(helper.codePrepare('handler.removeCallbacksAndMessages(null)', 0, 8, false))

  finishScene.push(helper.codePrepare('findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)', 0, 8, false))

  const buttonSizeSsp = helper.getResource(scene, { type: 'ssp', dp: '8' })
  scene = helper.addResource(scene, { type: 'ssp', dp: '8', spaces: 4 })

  const sdp15 = helper.getResource(scene, { type: 'sdp', dp: '15' })
  scene = helper.addResource(scene, { type: 'sdp', dp: '15', spaces: 4 })

  sceneCode += helper.codePrepare(`
    ${buttonSizeSsp.definition}val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${buttonSizeSsp.variable})
    buttonSave.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    ${sdp15.definition}layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(${sdp15.variable}, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()\n\n`, 0, 0, false
  )

  const sceneJson = {}

  sceneJson.scene = visualNovel.optimizations.hashScenesNames ? helper.hash(scene.name) : scene.name

  if (scene.background != '') {
    sceneJson.scenario = scene.background
  }

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

  const sdp23 = helper.getResource(scene, { type: 'sdp', dp: '23' })
  scene = helper.addResource(scene, { type: 'sdp', dp: '23', spaces: 4 })

  sceneCode += helper.codePrepare(`
      val newSave = "${JSON.stringify(JSON.stringify(sceneJson)).slice(1, -2)},\\"history\\":" + scenesToJson() + "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${buttonSizeSsp.variable})
    buttonMenu.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    ${sdp23.definition}layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(${sdp15.variable}, ${sdp23.variable}, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu\n\n`
  )

  if (finishScene.length != 0) {
    sceneCode += helper.codePrepare(`
      buttonMenu.setOnClickListener {
${finishScene.join('\n\n')}
  __PERFORVNM_START_MUSIC__\n\n`, 2, 0)
  } else {
    sceneCode += helper.codePrepare('buttonMenu.setOnClickListener {__PERFORVNM_START_MUSIC__' + '\n\n', 0, 4, false)
  }

  sceneCode += helper.codePrepare(`
      ${(visualNovel.menu ? visualNovel.menu.name : '__PERFORVNM_MENU__')}
    }

    frameLayout.addView(buttonMenu)\n\n`
  )

  if (visualNovel.scenes.length != 0) {
    const sdp46 = helper.getResource(scene, { type: 'sdp', dp: '46' })
    scene = helper.addResource(scene, { type: 'sdp', dp: '46', spaces: 4 })

    sceneCode += helper.codePrepare(`
      val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${buttonSizeSsp.variable})
      buttonBack.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp46.definition}layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(${sdp15.variable}, ${sdp46.variable}, 0, 0)

      buttonBack.layoutParams = layoutParamsBack\n\n`, 2
    )

    if (finishScene.length != 0) {
      sceneCode += helper.codePrepare(`
      buttonBack.setOnClickListener {
${finishScene.join('\n\n')}\n\n`, 2, 0)
    } else {
      sceneCode += helper.codePrepare('buttonBack.setOnClickListener {\n', 0, 2, false)
    }

    if (visualNovel.subScenes.find((subScene) => subScene.next == scene.name)) {
      sceneCode += helper.codePrepare(`
        val scene = scenes.get(scenesLength - 1)

        scenesLength--
        scenes.set(scenesLength, ${visualNovel.optimizations.hashScenesNames ? '0' : '""'})

        switchScene(scene)\n`, 2
      )
    } else {
      if (visualNovel.scenes.length == 1) {
        sceneCode += helper.codePrepare(`${visualNovel.scenes[visualNovel.scenes.length - 1].name}(${(visualNovel.scenes[visualNovel.scenes.length - 1].speech ? 'false' : '' )})\n`, 0, 6, false)
      } else {
        sceneCode += helper.codePrepare(`
          scenesLength--
          scenes.set(scenesLength, ${visualNovel.optimizations.hashScenesNames ? '0' : '""'})

          ${visualNovel.scenes[visualNovel.scenes.length - 1].name}(${(visualNovel.scenes[visualNovel.scenes.length - 1].speech ? 'false' : '' )})\n`, 4
        )
      }
    }

    sceneCode += helper.codePrepare(`
      }

      frameLayout.addView(buttonBack)\n\n`, 2
    )
  }

  if (scene.subScenes.length == 2) {
    const subScenesTextSsp = helper.getResource(scene, { type: 'ssp', dp: '12' })
    scene = helper.addResource(scene, { type: 'ssp', dp: '12', spaces: 4 })

    const sdp120 = helper.getResource(scene, { type: 'sdp', dp: '120' })
    scene = helper.addResource(scene, { type: 'sdp', dp: '120', spaces: 4 })

    sceneCode += helper.codePrepare(`
      ${subScenesTextSsp.definition}val buttonSubScenes = Button(this)
      buttonSubScenes.text = "${scene.subScenes[0].text}"
      buttonSubScenes.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${subScenesTextSsp.variable})
      buttonSubScenes.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonSubScenes.background = null

      val layoutParamsSubScenes = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp120.definition}layoutParamsSubScenes.gravity = Gravity.CENTER_HORIZONTAL
      layoutParamsSubScenes.setMargins(0, ${sdp120.variable}, 0, 0)

      buttonSubScenes.layoutParams = layoutParamsSubScenes\n\n`, 2
    )

    const functionParams = []
    if (scene.subScenes[0].speech && !scene.speech) functionParams.push('true')
    if (scene.subScenes[0].speech?.author?.name && scene.speech && !scene.speech?.author?.name && i + 1 != visualNovel.scenes.length - 1) functionParams.push('true')

    const sdp150 = helper.getResource(scene, { type: 'sdp', dp: '150' })
    scene = helper.addResource(scene, { type: 'sdp', dp: '150', spaces: 4 })

    sceneCode += helper.codePrepare(`
      buttonSubScenes.setOnClickListener {
        __PERFORVNM_SUBSCENE_1__
      }

      frameLayout.addView(buttonSubScenes)

      val buttonSubScenes2 = Button(this)
      buttonSubScenes2.text = "${scene.subScenes[1].text}"
      buttonSubScenes2.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${subScenesTextSsp.variable})
      buttonSubScenes2.setTextColor(0xFF${scene.options.buttonsColor}.toInt())
      buttonSubScenes2.background = null

      val layoutParamsSubScenes2 = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp150.definition}layoutParamsSubScenes2.gravity = Gravity.CENTER_HORIZONTAL
      layoutParamsSubScenes2.setMargins(0, ${sdp150.variable}, 0, 0)

      buttonSubScenes2.layoutParams = layoutParamsSubScenes2

      buttonSubScenes2.setOnClickListener {
        __PERFORVNM_SUBSCENE_2__
      }

      frameLayout.addView(buttonSubScenes2)\n\n`, 2
    )
  } else if (scene.subScenes.length != 0) {
    helper.logWarning('Unecessary sub-scenes, only 2 are allowed.', 'Android')
  }

  scene.custom.forEach((custom, index) => {
    switch (custom.type) {
      case 'text': {
        const customTextSsp = helper.getResource(scene, { type: 'ssp', dp: custom.fontSize })
        scene = helper.addResource(scene, { type: 'ssp', dp: custom.fontSize, spaces: 4 })

        sceneCode += helper.codePrepare(`
          ${customTextSsp.definition}val textViewCustomText${index} = TextView(this)
          textViewCustomText${index}.text = "${custom.text}"
          textViewCustomText${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${customTextSsp.variable})
          textViewCustomText${index}.setTextColor(0xFF${custom.color}.toInt())

          val layoutParamsCustomText${index} = LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
          )\n\n`, 8
        )

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.top })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.side })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            customCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomText${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomText${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomText${index}.gravity = Gravity.CENTER

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 12
            )

            break
          }
        }

        break
      }
      case 'button': {
        const customTextSsp = helper.getResource(scene, { type: 'ssp', dp: custom.fontSize })
        scene = helper.addResource(scene, { type: 'ssp', dp: custom.fontSize, spaces: 4 })

        sceneCode += helper.codePrepare(`
          ${customTextSsp.definition}val buttonCustomButton${index} = Button(this)
          buttonCustomButton${index}.text = "${custom.text}"
          buttonCustomButton${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${customTextSsp.variable})
          buttonCustomButton${index}.setTextColor(0xFF${custom.color}.toInt())
          buttonCustomButton${index}.background = null__PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomButton${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            sceneCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            sceneCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = helper.getResource(scene, { type: 'sdp', dp: custom.height })
            scene = helper.addResource(scene, { type: 'sdp', dp: custom.height, spaces: 4 })

            if (customHeight.definition) sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__`)

            sceneCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            sceneCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = helper.getResource(scene, { type: 'sdp', dp: custom.width })
            scene = helper.addResource(scene, { type: 'sdp', dp: custom.width, spaces: 4 })

            if (customWidth.definition) sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            sceneCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', '')
        sceneCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.top })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.side })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            sceneCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomButton${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomButton${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

              frameLayout.addView(buttonCustomButton${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomButton${index}.gravity = Gravity.CENTER

              buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

              frameLayout.addView(buttonCustomButton${index})\n\n`, 10
            )

            break
          }
        }

        break
      }
      case 'rectangle': {
        sceneCode += helper.codePrepare(`
          val rectangleViewCustomRectangle${index} = RectangleView(this)__PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomRectangle${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            sceneCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            sceneCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = helper.getResource(scene, { type: 'sdp', dp: custom.height })
            scene = helper.addResource(scene, { type: 'sdp', dp: custom.height, spaces: 4 })

            if (customHeight.definition) sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__${customHeight.additionalSpace}`)

            sceneCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            sceneCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = helper.getResource(scene, { type: 'sdp', dp: custom.width })
            scene = helper.addResource(scene, { type: 'sdp', dp: custom.width, spaces: 4 })

            if (customWidth.definition) sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            sceneCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', '')
        sceneCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.top })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.side })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            sceneCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomRectangle${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomRectangle${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

              frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomRectangle${index}.gravity = Gravity.CENTER

              rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

              frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 10
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

          __PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomImage${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            sceneCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            sceneCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = helper.getResource(scene, { type: 'sdp', dp: custom.height })
            scene = helper.addResource(scene, { type: 'sdp', dp: custom.height, spaces: 4 })

            if (customHeight.definition) sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__`)

            sceneCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            sceneCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            sceneCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = helper.getResource(scene, { type: 'sdp', dp: custom.width })
            scene = helper.addResource(scene, { type: 'sdp', dp: custom.width, spaces: 4 })

            if (customWidth.definition) sceneCode = sceneCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            sceneCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        sceneCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.top })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(scene, { type: 'sdp', dp: custom.position.margins.side })
              scene = helper.addResource(scene, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            sceneCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomImage${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomImage${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            sceneCode += helper.codePrepare(`
              layoutParamsCustomImage${index}.gravity = Gravity.CENTER

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})`, 10
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
      }`, 4
    )
  } else {
    if (scene.next) {
      sceneCode += helper.codePrepare(`
          findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
            scenes.set(scenesLength, ${helper.getSceneId(scene.name)})
            scenesLength++

            ${scene.next}(__PERFORVNM_NEXT_SCENE_PARAMS__)
          }

          setContentView(frameLayout)
        }`, 6
      )
    } else {
      sceneCode += helper.codePrepare(`
          setContentView(frameLayout)
        }`, 6
      )
    }
  }

  sceneCode = helper.finalizeResources(scene, sceneCode)

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
