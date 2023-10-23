import helper from '../../main/helper.js'
import { _GetSceneFParams, _GetSceneParams } from './params.js'

export function _ProcessWNextScene(i, scene, switchesCode, type) {
  const nextScene = AndroidVisualNovel.scenes.find((nScene) => nScene.name == scene.next.scene)

  if (!nextScene)
    helper.logFatal('Next scene does not exist.')

  const finishScene = []

  if (scene.next.item?.require?.fallback) {
    const fallbackScene = AndroidVisualNovel.scenes.find((fScene) => fScene.name == scene.next.item.require.fallback)
    const functionParams = _GetSceneParams(scene, fallbackScene)

    scene.code = scene.code.replace('__PERFORVNM_FALLBACK_SCENE_PARAMS__', functionParams.switch.join(', '))
  }

  if (scene.subScenes.length == 0 || type == 'subScene') {
    if (scene.effect || scene.music) {
      finishScene.push(
        helper.codePrepare(`
          if (mediaPlayer != null) {
            mediaPlayer!!.stop()
            mediaPlayer!!.release()
            mediaPlayer = null
          }\n`, 14
        )
      )
    }
  
    if (scene.effect && scene.music) {
      finishScene.push(
        helper.codePrepare(`
          if (mediaPlayer2 != null) {
            mediaPlayer2!!.stop()
            mediaPlayer2!!.release()
            mediaPlayer2 = null
          }\n`, 14
        )
      )
    }

    if (scene.speech || (scene.effect && scene.effect.delay != 0) || (scene.music && scene.music.delay != 0))
      finishScene.push(helper.codePrepare('handler.removeCallbacksAndMessages(null)', 0, 14, false))

    if (i == AndroidVisualNovel.scenes.length - 2)
      finishScene.push(helper.codePrepare('findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)', 0, 14, false))

    finishScene.push(helper.codePrepare('it.setOnClickListener(null)', 0, 14, false))

    let code = '\n\n' + helper.codePrepare(`
      findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
${finishScene.join('\n')}\n\n`, 8, 0)

    let functionParams = { function: [], switch: [] }
    if (i != AndroidVisualNovel.scenes.length - 2) functionParams = _GetSceneFParams(scene, nextScene)

    if (scene.speech && !nextScene.speech) {
      code += helper.codePrepare(`
        val animationRectangleSpeech = AlphaAnimation(${scene.speech.text.rectangle.opacity}f, 0f)
        animationRectangleSpeech.duration = 500
        animationRectangleSpeech.interpolator = LinearInterpolator()
        animationRectangleSpeech.fillAfter = true

        rectangleViewSpeech.startAnimation(animationRectangleSpeech)

        val animationTextSpeech = AlphaAnimation(1f, 0f)
        animationTextSpeech.duration = 500
        animationTextSpeech.interpolator = LinearInterpolator()
        animationTextSpeech.fillAfter = true

        textViewSpeech.startAnimation(animationTextSpeech)

        val animationAuthorSpeech = AlphaAnimation(${scene.speech.author.rectangle.opacity}f, 0f)
        animationAuthorSpeech.duration = 500
        animationAuthorSpeech.interpolator = LinearInterpolator()
        animationAuthorSpeech.fillAfter = true

        rectangleViewAuthor.startAnimation(animationAuthorSpeech)\n\n`, 8
      )

      if (scene.speech.author?.name) {
        code += helper.codePrepare('textViewAuthor.startAnimation(animationTextSpeech)\n\n', 0, 6, false)
      }

      code += helper.codePrepare(`
        animationAuthorSpeech.setAnimationListener(object : Animation.AnimationListener {
          override fun onAnimationStart(animation: Animation?) {}

          override fun onAnimationEnd(animation: Animation?) {
            scenes.set(scenesLength, ${helper.getSceneId(scene.name)})
            scenesLength++

            ${nextScene.name}(${functionParams.switch.join(', ')})
          }

          override fun onAnimationRepeat(animation: Animation?) {}
        })\n`, 8
      )
    } else {
      // experimental: with type == 'subScene'
      code += helper.codePrepare(`
        scenes.set(scenesLength, ${helper.getSceneId(scene.name)})
        scenesLength++

        ${nextScene.name}(${functionParams.switch.join(', ')})\n`, 8
      )
    }

    code += helper.codePrepare('}', 0, 4, false)

    scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}__`, code)

    if (type == 'subScene') {
      // /* TODO: Switch oldScene with scene to match original function */
      const functionParams2 = _GetSceneFParams(scene, nextScene)

      scene.code = scene.code.replace('__PERFORVNM_NEXT_SCENE_PARAMS__', functionParams2.switch.join(', '))
      scene.code = scene.code.replace('__PERFORVNM_SCENE_PARAMS__', functionParams2.function.join(', '))

      if (scene.speech) {
        const speechHandler = helper.codePrepare(`
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
          }\n`, 6, 0, false
        )

        scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
      }
    }
  } else {
    const subScene1 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[0].scene)
    const subScene2 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[1].scene)

    if (!subScene1 || !subScene2)
      helper.logFatal('A subscene does not exist.')

    subScene1.parent = scene.name
    subScene2.parent = scene.name

    /* TODO: Switch oldScene with scene to match original function */
    /* TODO: May be switched already compared to the one below of sub-scenes, must be tested. */
    const subFunctionParams = _GetSceneParams(subScene1, scene)
    const subFunctionParams2 = _GetSceneParams(subScene2, scene)

    scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_1__', `${subScene1.name}(${subFunctionParams.join(', ')})`)
    scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_2__', `${subScene2.name}(${subFunctionParams2.join(', ')})`)

    scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}__`, '')
  }

  /* TODO: Switch oldScene with scene to match original function */
  const functionParams = _GetSceneParams(scene, nextScene)
  const functionParams2 = _GetSceneFParams(nextScene, scene)

  switchesCode += helper.codePrepare(`\n${helper.getSceneId(scene.name)} -> ${scene.name}(${functionParams2.switch.join(', ').replace(/true/g, 'false')})`, 0, 6, false)

  scene.code = scene.code.replace('__PERFORVNM_SCENE_PARAMS__', functionParams2.function.join(', '))
  scene.code = scene.code.replace('__PERFORVNM_NEXT_SCENE_PARAMS__', functionParams.switch.join(', '))

  if (scene.speech) {
    const speechHandler = helper.codePrepare(`
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
      }\n`, 2, 0, false
    )

    scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
  }

  return {
    code: scene.code,
    switchesCode: switchesCode
  }
}

export function _ProcessWONextScene(i, scene, switchesCode, type) {
  const oldScene = AndroidVisualNovel.scenes[i - 1]

  if (scene.subScenes.length != 0 && type == 'scene') {
    const subScene1 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[0].scene)
    const subScene2 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[1].scene)

    if (!subScene1 || !subScene2)
      helper.logFatal('A subscene does not exist.')

    subScene1.parent = scene.name
    subScene2.parent = scene.name

    /* TODO: Switch oldScene with scene to match original function */
    const subFunctionParams = _GetSceneParams(scene, subScene1)
    const subFunctionParams2 = _GetSceneParams(scene, subScene2)

    scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_1__', `${subScene1.name}(${subFunctionParams.switch.join(', ')})`)
    scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_2__', `${subScene2.name}(${subFunctionParams2.switch.join(', ')})`)
  }

  /* TODO: Switch oldScene with scene to match original function */
  const functionParams = _GetSceneParams(oldScene, scene)

  switchesCode += helper.codePrepare(`\n${helper.getSceneId(scene.name)} -> ${scene.name}(${functionParams.switch.join(', ').replace(/true/g, 'false')})`, 0, 6, false)

  scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}__`, '')
  scene.code = scene.code.replace('__PERFORVNM_SCENE_PARAMS__', functionParams.function.join(', '))

  if (scene.speech) {
    const speechHandler = helper.codePrepare(`
      var i = 0

      handler.postDelayed(object : Runnable {
        override fun run() {
          if (i < speechText.length) {
            textViewSpeech.text = speechText.substring(0, i + 1)
            i++
            handler.postDelayed(this, textSpeed)
          }
        }
      }, textSpeed)\n`, 2, 0, false
    )

    scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
  }

  return {
    code: scene.code,
    switchesCode: switchesCode
  }
}

export function _ProcessSceneSave(scene) {
  let savesSwitchLocal = helper.codePrepare(`
    ${helper.getSceneId(scene.name)} -> {
      when (characterData.getString("name")) {`, 0, 6, false
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

  return savesSwitchLocal + '\n' + helper.codePrepare('}\n', 0, 12, false) + helper.codePrepare('}', 0, 10, false)
}

export function _FinalizeScenesSave(savesSwitchCode) {
  return helper.codePrepare(`
    when (buttonData.get${visualNovel.optimizations.hashScenesNames ? 'Int' : 'String'}("scene")) {`, 0, 4
  ) + savesSwitchCode + '\n' + 
  helper.codePrepare('}', 0, 8, false)
}