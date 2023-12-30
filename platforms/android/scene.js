/* TODO (unconfirmed): Set the scenes in order through a queue [ 'scene1', 'scene2', ... ] */

import helper from '../main/helper.js'
import { _GetResource, _AddResource, _FinalizeResources } from './helpers/optimizations.js'
import { _GetSceneFParams, _GetSceneParams } from './helpers/params.js'

import { _AchievementWrapperGive } from './achievements.js'
import { _ItemGive, _ItemRemove, _ItemsSaver } from './items.js'
import { _AddCustoms } from './custom.js'

function init(options) {
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
    achievements: [],
    items: {
      give: [],
      require: []
    },
    custom: [],
    resources: {}
  }
}

function addCharacter(scene, options) {
  scene.characters.push({ name: options.name, image: options.image, position: options.position, animations: options.animations })

  return scene
}

function addScenario(scene, options) {
  scene.background = options.image

  return scene
}

function addSpeech(scene, options) {
  scene.speech = options
  scene.speech.text.content = JSON.stringify(options.text.content).slice(1, -1)

  AndroidVisualNovel.internalInfo.hasSpeech = true

  return scene
}

function addSoundEffects(scene, options) {
  scene.effect = options

  AndroidVisualNovel.internalInfo.hasEffect = true

  return scene
}

function addMusic(scene, options) {
  scene.music = options

  AndroidVisualNovel.internalInfo.hasSceneMusic = true

  return scene
}

function addTransition(scene, options) {
  scene.transition = options

  return scene
}

function setNextScene(scene, options) {
  scene.next = options

  return scene
}

function addSubScenes(scene, options) {
  scene.subScenes = options

  return scene
}

export function _ProcessScenes() {
  const sceneKeys = Object.values(visualNovel.scenes)
  const subSceneKeys = Object.values(visualNovel.subScenes)

  sceneKeys.forEach((scene, i) => _ProcessScene(scene, sceneKeys[i + 1], sceneKeys[i - 1], i))

  subSceneKeys.forEach((scene, i) => _ProcessScene(scene, subSceneKeys[i + 1], subSceneKeys[i - 1], i))

  const switchSceneCode = helper.codePrepare(`
    private fun switchScene(${visualNovel.optimizations.hashScenesNames ? 'scene: Int' : 'scene: String'}) {
      when (scene) {
        __IGNORE_INDENTATION__   
${AndroidVisualNovel.switchScene.join('\n')}
        __IGNORE_INDENTATION__
      }
    }`,
    2
  )

  helper.writeFunction('Android', switchSceneCode)
}

export function _ProcessScene(scene, next, past, sceneIndex) {
  let sceneParams = null
  let parentScene = null
  if (scene.type == 'normal') {
    sceneParams = _GetSceneParams(scene, past, 'false', sceneIndex)
  } else {
    Object.values(visualNovel.scenes).forEach((sceneV) => {
      if (sceneV.subScenes.length != 0) {
        sceneV.subScenes.forEach((subScene) => {
          if (subScene.scene == scene.name) {
            parentScene = sceneV
          }
        })
      }
    })

    if (!parentScene)
      helper.logFatalError(`Scene ${scene.name} has no parent scene`)

    sceneParams = _GetSceneParams(parentScene, scene)
  }

  _ProcessSceneSave(scene)

  AndroidVisualNovel.switchScene.push(
    helper.codePrepare(
      `\n${helper.getSceneId(scene.name)} -> ${scene.name}(${sceneParams.switch.join(', ').replace(/true/g, 'false')})`,
      0,
      6
    )
  )

  let sceneCode = helper.codePrepare(`
    private fun ${scene.name}(${sceneParams.function}) {
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

    if (scene.transition) {
      //REWORK

      sceneCode += helper.codePrepare(`
        if (animate)
          imageView_scenario.startAnimation(animationFadeIn)\n\n`, 4
      )
    }
  }

  //REWORK
  scene.characters.forEach((character) => {
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

        const characterMargin = character.position.margins

        let marginSideSdp = null
        if (characterMargin.side != 0) {
          marginSideSdp = _GetResource(scene, { type: 'sdp', dp: characterMargin.side })
          scene = _AddResource(scene, { type: 'sdp', dp: characterMargin.side, spaces: 4 })

          if (marginSideSdp.definition) definitions += marginSideSdp.definition
        }

        let marginTopSdp = null
        if (characterMargin.top != 0) {
          marginTopSdp = _GetResource(scene, { type: 'sdp', dp: characterMargin.top })
          scene = _AddResource(scene, { type: 'sdp', dp: characterMargin.top, spaces: 4 })

          if (marginTopSdp.definition) definitions += marginTopSdp.definition
        }

        let layoutParams = helper.codePrepare(`layoutParams_${character.name}.setMargins(`, 0, 4, false)

        layoutParams += characterMargin.side != 0 && character.position.side == 'left' ? `${marginSideSdp.variable}, ` : '0, '
        layoutParams += characterMargin.top != 0 ? `${marginTopSdp.variable}, ` : '0, '
        layoutParams += characterMargin.side != 0 && character.position.side == 'right' ? `${marginSideSdp.variable}, ` : '0, '
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

    let spaceAmount = 4
    const finalCode = []
    let characteristics = {
      rotation: 0,
      scale: 1,
      alpha: 1,
      x: 0,
      y: 0
    }

    if (scene.transition) {
      spaceAmount += 4

      if (sceneIndex == 0 || scene.subScenes.length != 0) {
        sceneCode += helper.codePrepare(`
          if (animate) {`, 6, 0, false
        )

        finalCode.push(
          helper.codePrepare('__PERFORVNM_ANIMATION_SETS__', 0, 0, false)
        )

        spaceAmount += 2
      }

      sceneCode += helper.codePrepare(`
        imageView_${character.name}.startAnimation(animationFadeIn)

        animationFadeIn.setAnimationListener(object : Animation.AnimationListener {
          override fun onAnimationStart(animation: Animation?) {}

          override fun onAnimationEnd(animation: Animation?) {\n`, 12 - spaceAmount, 0, false
      )

      finalCode.push(
        helper.codePrepare(`
            }

            override fun onAnimationRepeat(animation: Animation?) {}
          })\n`, 4
        )
      )
    }

    if (character.animations) {
      character.animations.forEach((animation, i) => {
        if (animation.delay != 0) {
          sceneCode += helper.codePrepare(`
            handler.postDelayed(object : Runnable {
              override fun run() {\n`, 12, spaceAmount
          )

          finalCode.push(
            helper.codePrepare(`
                }
              }, ${animation.delay})\n`, 14, spaceAmount
            )
          )

          spaceAmount += 4
        }

        sceneCode += helper.codePrepare(`imageView_${character.name}.animate()\n`, 0, spaceAmount, false)

        switch (animation.type) {
          case 'movement': {
            sceneCode += helper.codePrepare(`
              .translationX(${(animation.side == 'center' ? `((frameLayout.width - imageView_${character.name}.width) / 2).toFloat()` : animation.margins.side)}f)
              .translationY(${(animation.side == 'center' ? `((frameLayout.height - imageView_${character.name}.height) / 2).toFloat()` : animation.margins.top)}f)\n`, 12, spaceAmount
            )

            characteristics.x = animation.side == 'center' ? `((frameLayout.width - imageView_${character.name}.width) / 2).toFloat()` : animation.margins.side
            characteristics.y = animation.side == 'center' ? `((frameLayout.height - imageView_${character.name}.height) / 2).toFloat()` : animation.margins.top

            break
          }
          case 'fadeIn':
          case 'fadeOut': {
            sceneCode += helper.codePrepare(`.alpha(${(animation.type == 'fadeIn' ? 1 : 0)}f)\n`, 0, 2 + spaceAmount, false)

            characteristics.alpha = animation.type == 'fadeIn' ? 1 : 0

            break
          }
          case 'rotate': {
            sceneCode += helper.codePrepare(`.rotation(${animation.degrees}f)\n`, 0, 2 + spaceAmount, false)

            characteristics.rotation = animation.degrees

            break
          }
          case 'scale': {
            sceneCode += helper.codePrepare(`
              .scaleX(${animation.scale}f)
              .scaleY(${animation.scale}f)\n`, 12, spaceAmount
            )

            characteristics.scale = animation.scale

            break
          }
          case 'jump': {
            sceneCode += helper.codePrepare(`
              .translationY(${animation.margins.top}f)
              .setDuration(${animation.duration / 2})
              .setInterpolator(OvershootInterpolator())
              .setListener(object : Animator.AnimatorListener {
                override fun onAnimationStart(animation: Animator) {}

                override fun onAnimationEnd(animation: Animator) {
                  imageView_${character.name}.animate()
                    .translationY(0f)
                    .setDuration(${animation.duration / 2})
                    .setInterpolator(OvershootInterpolator())\n`, 12, spaceAmount
            )

            finalCode.push(
              helper.codePrepare(`
                  }

                  override fun onAnimationCancel(animation: Animator) {}

                  override fun onAnimationRepeat(animation: Animator) {}
                })\n`, 14, spaceAmount
              )
            )

            spaceAmount += 6
          }
        }

        if (animation.type != 'jump') {
          sceneCode += helper.codePrepare(`
            .setDuration(${animation.duration})
            .setInterpolator(LinearInterpolator())\n`, 10, spaceAmount
          )
        }

        if (character.animations.length - 1 == i) {
          sceneCode += helper.codePrepare(`.start()\n`, 0, 2 + spaceAmount, false)
        } else {
          sceneCode += helper.codePrepare(`
            .setListener(object : Animator.AnimatorListener {
              override fun onAnimationStart(animation: Animator) {}

              override fun onAnimationEnd(animation: Animator) {\n`, 10, spaceAmount
          )

          finalCode.push(
            helper.codePrepare(`
                }

                override fun onAnimationCancel(animation: Animator) {}

                override fun onAnimationRepeat(animation: Animator) {}
              })
              .start()\n`, 12, spaceAmount
            )
          )

          spaceAmount += 6
        }
      })

      if (visualNovel.scenes.length == 0 || scene.subScenes.length != 0) {
        const position = []

        if (characteristics.rotation != 0) {
          position.push(
            helper.codePrepare(`imageView_${character.name}.rotation = ${characteristics.rotation}f`, 0, 12, false)
          )
        }
        if (characteristics.scale != 1) {
          position.push(
            helper.codePrepare(`
              imageView_${character.name}.scaleX = ${characteristics.scale}f
              imageView_${character.name}.scaleY = ${characteristics.scale}f`, 0, 12, false
            )
          )
        }
        if (characteristics.alpha != 1) {
          position.push(
            helper.codePrepare(`imageView_${character.name}.alpha = ${characteristics.alpha}f`, 0, 12, false)
          )
        }
        if (characteristics.x != 0) {
          position.push(
            helper.codePrepare(`imageView_${character.name}.translationX = ${characteristics.x}f`, 0, 12, false)
          )
        }
        if (characteristics.y != 0) {
          position.push(
            helper.codePrepare(`imageView_${character.name}.translationY = ${characteristics.y}f`, 0, 12, false)
          )
        }

        const animationsSet = helper.codePrepare(`
          } else {
${position.join('\n')}
          }\n`, 6
        )

        finalCode[0] = finalCode[0].replace('__PERFORVNM_ANIMATION_SETS__', animationsSet)
      }
    }

    if (finalCode.length != 0) {
      finalCode.reverse()

      sceneCode += finalCode.join('')
    }
  })

  const SceneKeys = Object.keys(visualNovel.scenes)
  const SubSceneKeys = Object.keys(visualNovel.subScenes)

  let redirectAmount = 0, oldScene, olderOldScene
  SceneKeys.forEach((key) => {
    const sceneK = visualNovel.scenes[key]

    if (sceneK?.next?.scene == scene.name) {
      oldScene = sceneK
      redirectAmount++
    }
    if (sceneK.next?.item?.require?.fallback == scene.name) {
      oldScene = sceneK
      redirectAmount++
    }
    if (sceneK?.next?.scene == SceneKeys[visualNovel.scenesLength - 1]) {
      olderOldScene = sceneK
    }
    sceneK.subScenes.forEach((subScene) => {
      if (subScene.scene == scene.name) {
        oldScene = sceneK
        redirectAmount++
      }
    })
  })

  SubSceneKeys.forEach((key) => {
    const subSceneK = visualNovel.subScenes[key]

    if (subSceneK.next.scene == scene.name) {
      oldScene = subSceneK
      redirectAmount++
    }
    if (subSceneK.next?.item?.require?.fallback == scene.name) {
      oldScene = subSceneK
      redirectAmount++
    }
    if (subSceneK.next.scene == SceneKeys[visualNovel.scenesLength - 1]) {
      olderOldScene = subSceneK
    }
    subSceneK.subScenes.forEach((subScene) => {
      if (subScene.scene == scene.name) {
        oldScene = subSceneK
        redirectAmount++
      }
    })
  })

  let sdp53 = null
  if (scene.speech) {
    sdp53 = _GetResource(scene, { type: 'sdp', dp: '53' })
    scene = _AddResource(scene, { type: 'sdp', dp: '53', spaces: 4 })

    sceneCode += helper.codePrepare(`
      val rectangleViewSpeech = RectangleView(this)

      ${sdp53.definition}val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, ${sdp53.variable})
      layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech\n`, 2, 0, false
    )

    if (visualNovel.scenes.length != 0 && oldScene?.speech) {
      sceneCode += helper.codePrepare(`rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)\n`, 0, 4, false)
    }

    sceneCode += helper.codePrepare(`rectangleViewSpeech.setColor(0xFF${scene.speech.text.rectangle.color}.toInt())\n\n`, 0, 4, false)

    if (sceneIndex == 0 || !oldScene?.speech || scene.subScenes.length != 0) {
      sceneCode += helper.codePrepare(`
        if (animate) {
          val animationRectangleSpeech = AlphaAnimation(0f, ${scene.speech.text.rectangle.opacity}f)
          animationRectangleSpeech.duration = 1000
          animationRectangleSpeech.interpolator = LinearInterpolator()
          animationRectangleSpeech.fillAfter = true

          rectangleViewSpeech.startAnimation(animationRectangleSpeech)
        } else {
          rectangleViewSpeech.setAlpha(${scene.speech.text.rectangle.opacity}f)
        }\n\n`, 4
      )
    }

    const speechTextSsp = _GetResource(scene, { type: 'ssp', dp: scene.speech.text.fontSize })
    scene = _AddResource(scene, { type: 'ssp', dp: scene.speech.text.fontSize, spaces: 4 })

    const sdp270 = _GetResource(scene, { type: 'sdp', dp: '270' })
    scene = _AddResource(scene, { type: 'sdp', dp: '270', spaces: 4 })

    const speechHandlerCode = scene.speech ? helper.codePrepare(`
      if (animate) {
        var i = 0

        handler.postDelayed(object : Runnable {
          override fun run() {
            if (i < speechText.length) {
              textViewSpeech.text = speechText.substring(0, i + 1)
              i++
              handler.postDelayed(this, textSpeed)
            }
          }
        }, textSpeed)
      } else {
        textViewSpeech.text = speechText
      }\n`, 0, 0, false
    ) : ''

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

      var speechText = "${scene.speech.text.content}"${speechHandlerCode}
      frameLayout.addView(textViewSpeech)

      val rectangleViewAuthor = RectangleView(this)

      val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
      layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
      layoutParamsRectangleAuthor.setMargins(0, 0, 0, ${sdp53.variable})

      rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor\n`, 2
    )

    if (visualNovel.scenes.length != 0 && oldScene?.speech) {
      sceneCode += helper.codePrepare(`rectangleViewAuthor.setAlpha(${scene.speech.author.rectangle.opacity}f)\n`, 0, 4, false)
    }

    sceneCode += helper.codePrepare(`rectangleViewAuthor.setColor(0xFF${scene.speech.author.rectangle.color}.toInt())\n\n`, 0, 4, false)

    if (sceneIndex == 0 || !oldScene?.speech || scene.subScenes.length != 0) {
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
      const authorTextSsp = _GetResource(scene, { type: 'ssp', dp: '13' })
      scene = _AddResource(scene, { type: 'ssp', dp: '13', spaces: 4 })

      const sdp135 = _GetResource(scene, { type: 'sdp', dp: '155' })
      scene = _AddResource(scene, { type: 'sdp', dp: '155', spaces: 4 })

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
        !oldScene?.speech ||
        scene.subScenes.length != 0 ||
        (visualNovel.scenes.length != 0 &&
          scene.speech?.author?.name &&
          oldScene?.speech &&
          !oldScene?.speech?.author?.name)
        ) {
          if (visualNovel.scenes.length != 0 && scene.speech?.author?.name && oldScene?.speech && !oldScene?.speech?.author?.name) {
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
      let spaceAmount = 4

      if (scene.music.delay != 0) {
        spaceAmount += 4

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
        mediaPlayer = MediaPlayer.create(this, R.raw.${scene.music.music})

        if (mediaPlayer != null) {
          mediaPlayer!!.start()

          mediaPlayer!!.setVolume(musicVolume, musicVolume)

          mediaPlayer!!.setOnCompletionListener {
            if (mediaPlayer != null) {
              mediaPlayer!!.stop()
              mediaPlayer!!.release()
              mediaPlayer = null
            }
          }
        }\n`, 8, spaceAmount
      )

      if (finalCode.length != 0) {
        finalCode.reverse()

        sceneCode += finalCode.join('')

        finalCode = []
      }
    }

    if (scene.effect) for (let effect of scene.effect) {
      let spaceAmount = 4

      if (effect.delay != 0) {
        spaceAmount += 4

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
        ${mediaPlayerName} = MediaPlayer.create(this@MainActivity, R.raw.${effect.sound})

        if (${mediaPlayerName} != null) {
          ${mediaPlayerName}!!.start()

          ${mediaPlayerName}!!.setVolume(sEffectVolume, sEffectVolume)

          ${mediaPlayerName}!!.setOnCompletionListener {
            if (${mediaPlayerName} != null) {
              ${mediaPlayerName}!!.stop()
              ${mediaPlayerName}!!.release()
              ${mediaPlayerName} = null
            }
          }
        }\n`, 8, spaceAmount
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
        }`, 2
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
        }`, 2
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
    finishScene.push(helper.codePrepare('handler.removeCallbacksAndMessages(null)', 0, 6, false))

  finishScene.push(helper.codePrepare('findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)', 0, 6, false))

  const itemRemover = []
  if (scene.items.give.length != 0) {
    scene.items.give.forEach((item) => {
      itemRemover.push(_ItemRemove(item))
    })
  }

  const buttonSizeSsp = _GetResource(scene, { type: 'ssp', dp: '8' })
  scene = _AddResource(scene, { type: 'ssp', dp: '8', spaces: 4 })

  const sdp15 = _GetResource(scene, { type: 'sdp', dp: '15' })
  scene = _AddResource(scene, { type: 'sdp', dp: '15', spaces: 4 })

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
      const characterJson = {
        name: character.name
      }

      if (!visualNovel.optimizations.preCalculateScenesInfo)
        characterJson.image = character.image

      if (!visualNovel.optimizations.preCalculateRounding) {
        characterJson.position = {
          sideType: character.position.side,
          side: character.position.margins.side,
        }

        if (character.position.side != 'center') {
          if (character.position.margins.top != 0) {
            characterJson.position.sideType += 'Top'

            characterJson.position.top = character.position.margins.top
          }

          if (character.position.margins.side == 0 && character.position.margins.top != 0)
            characterJson.position.sideType = 'top'
        }
      }

      sceneJson.characters.push(characterJson)
    })
  }

  const sdp23 = _GetResource(scene, { type: 'sdp', dp: '23' })
  scene = _AddResource(scene, { type: 'sdp', dp: '23', spaces: 4 })

  const itemSaverJSON = visualNovel.items.length != 0 ? _ItemsSaver() : ''

  sceneCode += helper.codePrepare(`
      val newSave = "${JSON.stringify(JSON.stringify(sceneJson)).slice(1, -2)},\\"history\\":" + scenesToJson() +${itemSaverJSON} "}"

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

  let itemsRemove = ''
  if (visualNovel.items.length != 0) {
    itemsRemove = helper.codePrepare(`\n
      for (j in 0 until itemsLength) {
        items.set(j, ${visualNovel.optimizations.hashItemsId ? '0' : '""'})
      }
      itemsLength = 0`, 0, 4, false
    )
  }

  const startMusicCode = helper.codePrepare(`\n
    mediaPlayer = MediaPlayer.create(this, R.raw.${visualNovel.menu?.background.music})

    if (mediaPlayer != null) {
      mediaPlayer!!.start()

      val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
      mediaPlayer!!.setVolume(volume, volume)

      mediaPlayer!!.setOnCompletionListener {
        mediaPlayer!!.start()
      }
    }`, 0, 2, false
  )

  sceneCode += helper.codePrepare(`
        buttonMenu.setOnClickListener {
          for (j in 0 until scenesLength) {
            scenes.set(j, ${visualNovel.optimizations.hashScenesNames ? '0' : '""'})
          }
          scenesLength = 0${itemsRemove}

          __IGNORE_INDENTATION__
${finishScene.join('\n\n')}${startMusicCode}
          __IGNORE_INDENTATION__

          ${(visualNovel.menu ? 'menu()' : '// No menu initialized.')}
        }

        frameLayout.addView(buttonMenu)\n\n`, 4
  )

  if (sceneIndex != 0 || parentScene) {
    const sdp46 = _GetResource(scene, { type: 'sdp', dp: '46' })
    scene = _AddResource(scene, { type: 'sdp', dp: '46', spaces: 4 })

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

      buttonBack.layoutParams = layoutParamsBack

      buttonBack.setOnClickListener {
        __IGNORE_INDENTATION__
${finishScene.join('\n\n')}${itemRemover.length != 0 ? itemRemover.join('\n\n') : '\n'}\n
        __IGNORE_INDENTATION__`, 2
    )

    if (redirectAmount > 1) {
      sceneCode += helper.codePrepare(`
        val scene = scenes.get(scenesLength - 1)

        scenesLength--
        scenes.set(scenesLength, ${visualNovel.optimizations.hashScenesNames ? '0' : '""'})

        switchScene(scene)\n`, 2
      )
    } else if (oldScene) {
      const functionParams = _GetSceneParams(oldScene, olderOldScene, 'false')

      if (visualNovel.scenes.length == 1) {
        sceneCode += helper.codePrepare(`${oldScene.name}(${functionParams.switch.join(', ')})\n`, 0, 6, false)
      } else {
        sceneCode += helper.codePrepare(`
          scenesLength--
          scenes.set(scenesLength, ${visualNovel.optimizations.hashScenesNames ? '0' : '""'})

          ${oldScene.name}(${functionParams.switch.join(', ')})\n`, 4
        )
      }
    }

    sceneCode += helper.codePrepare(`
      }

      frameLayout.addView(buttonBack)\n\n`, 2
    )
  }

  if (scene.subScenes.length == 2) {
    const subScenesTextSsp = _GetResource(scene, { type: 'ssp', dp: '12' })
    scene = _AddResource(scene, { type: 'ssp', dp: '12', spaces: 4 })

    const sdp120 = _GetResource(scene, { type: 'sdp', dp: '120' })
    scene = _AddResource(scene, { type: 'sdp', dp: '120', spaces: 4 })

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

    const sdp150 = _GetResource(scene, { type: 'sdp', dp: '150' })
    scene = _AddResource(scene, { type: 'sdp', dp: '150', spaces: 4 })

    let requireItems = [ '', '' ]
    let i = 0

    while (true) {
      if (scene.subScenes[i].item?.require) {
        requireItems[i] = helper.codePrepare(`
          if (!items.contains(${helper.getItemId(scene.subScenes[0].item.require)})) {
            Toast.makeText(this, "You don't have the required item.", Toast.LENGTH_SHORT).show()`, 4)

        if (scene.subScenes[i].item.remove) {
          requireItems[i] += helper.codePrepare(`
              items.remove(${helper.getItemId(scene.subScenes[0].item.require)})

              return@setOnClickListener
            }\n\n`, 6, 0, false)
        } else {
          requireItems[i] += helper.codePrepare(`\n
              return@setOnClickListener
            }\n\n`, 6, 0, false)
        }
      }

      if (i == 1) break

      i++
    }

    const subFunctionParams = _GetSceneParams(visualNovel.subScenes[scene.subScenes[0].scene], scene)
    const subFunctionParams2 = _GetSceneParams(visualNovel.subScenes[scene.subScenes[1].scene], scene)

    sceneCode += helper.codePrepare(`
        buttonSubScenes.setOnClickListener {
          __IGNORE_INDENTATION__
${requireItems[0]}${finishScene.join('\n\n')}
          __IGNORE_INDENTATION__

          scenes.set(scenesLength, ${helper.getSceneId(scene.subScenes[0].scene)})
          scenesLength++

          ${scene.subScenes[0].scene}(${subFunctionParams.switch.join(', ')})
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
          __IGNORE_INDENTATION__
${requireItems[1]}${finishScene.join('\n\n')}
          __IGNORE_INDENTATION__

          scenes.set(scenesLength, ${helper.getSceneId(scene.subScenes[1].scene)})
          scenesLength++

          ${scene.subScenes[1].scene}(${subFunctionParams2.switch.join(', ')})
        }

        frameLayout.addView(buttonSubScenes2)\n\n`, 4
    )
  } else if (scene.subScenes.length != 0) {
    /* TODO: Allow to have more than 2 sub-scenes */
    helper.logWarning('Unecessary sub-scenes, only 2 are allowed.', 'Android')
  }

  if (scene.custom.length != 0 ) {
    const tmp = _AddCustoms(scene, scene.custom)
    scene = tmp.scene
    sceneCode += tmp.code    
  }
  if (scene.achievements.length != 0) sceneCode += _AchievementWrapperGive(scene.achievements)
  if (scene.items.give.length != 0) scene.items.give.forEach((item) => sceneCode += _ItemGive(item))

  if (scene.next?.scene) {
    const nextSceneParams = _GetSceneFParams(scene, visualNovel.scenes[scene.next.scene])

    let nextCode = helper.codePrepare(`${scene.next.scene}(${nextSceneParams.switch.join(', ')})`, 0, 10, false)

    if (scene.next.item?.require) {
      const fallbackSceneParams = _GetSceneParams(scene, visualNovel.scenes[scene.next.item.require.fallback])

      nextCode = helper.codePrepare(`
        if (!items.contains(${helper.getItemId(scene.next.item.require.id)})) {
          ${scene.next.item.require.fallback}(${fallbackSceneParams.switch.join(', ')})
        } else {
          ${scene.next.scene}(${nextSceneParams.switch.join(', ')})
        }`, 0, 2)
    }
    sceneCode += helper.codePrepare(`
        findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
          __IGNORE_INDENTATION__
${finishScene.join('\n\n')}
          __IGNORE_INDENTATION__

          scenes.set(scenesLength, ${helper.getSceneId(scene.name)})
          scenesLength++

${nextCode}
        }

        setContentView(frameLayout)
      }`, 4
    )
  } else {
    sceneCode += helper.codePrepare(`
        setContentView(frameLayout)
      }`, 4
    )
  }

  sceneCode = _FinalizeResources(scene, sceneCode)

  helper.writeFunction('Android', sceneCode)
}

export function _ProcessSceneSave(scene) {
  let savesSwitchLocal = helper.codePrepare(`
    ${helper.getSceneId(scene.name)} -> {
      when (characterData.getString("name")) {`, 0, 6
  )

  scene.characters.forEach((character) => {
    let optimizedSetImage = ''
    if (visualNovel.optimizations.preCalculateScenesInfo) {
      optimizedSetImage = helper.codePrepare(`
        imageViewCharacter.setImageResource(R.raw.${character.image})\n\n                    `, 8
      )
    }
    switch (character.position.side) {
      case 'left': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'leftTop': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)
            val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.top * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'right': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val rightDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'rightTop': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val rightDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)
            val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.top * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'top': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'center': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
    }
  })

  AndroidVisualNovel.savesWhen.push(
    savesSwitchLocal +
    '\n' +
    helper.codePrepare('}\n', 0, 12, false) +
    helper.codePrepare('}', 0, 10, false)
  )

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
  addSubScenes
}