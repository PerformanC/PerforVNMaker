/* TODO: Remove ability to use achievements, items and menu init functions after using scene.finalize */

import fs from 'fs'

import helper from '../main/helper.js'

import achievements from './achievements.js'
import { _ItemsParsingFunction, _ItemsRestore, _ItemsSaver } from './items.js'

global.AndroidVisualNovel = { menu: null, internalInfo: {}, code: '', scenes: [], subScenes: [], achievements: [], items: [], customXML: [] }
global.PerforVNM = {
  codeGeneratorVersion: '1.23.0',
  generatedCodeVersion: '1.21.0',
  repository: 'https://github.com/PerformanC/PerforVNMaker'
}

function init(options) {
  helper.logOk('Starting VN, coding main code.', 'Android')

  /* TODO: Only add necessary `import`s */
  AndroidVisualNovel.code = helper.codePrepare(`
    package ${options.applicationId}

    import java.io.File
    import java.io.InputStreamReader
    import org.json.JSONArray__PERFORVNM_HEADERS__

    import android.os.Build
    import android.os.Bundle
    import android.os.Handler
    import android.os.Looper
    import android.app.Activity
    import android.util.TypedValue
    import android.media.MediaPlayer
    import android.widget.Toast
    import android.widget.TextView
    import android.widget.ImageView
    import android.widget.ScrollView
    import android.widget.FrameLayout
    import android.widget.FrameLayout.LayoutParams
    import android.widget.Button
    import android.widget.SeekBar
    import android.view.View
    import android.view.Gravity
    import android.view.animation.Animation
    import android.view.animation.LinearInterpolator
    import android.view.animation.OvershootInterpolator
    import android.view.animation.AlphaAnimation
    import android.animation.Animator
    import android.text.TextUtils
    import android.text.SpannableStringBuilder
    import android.text.style.ClickableSpan
    import android.text.method.LinkMovementMethod
    import android.graphics.Paint
    import android.graphics.Canvas
    import android.graphics.ColorMatrix
    import android.graphics.ColorMatrixColorFilter
    import android.content.Context
    import android.content.SharedPreferences

    class MainActivity : Activity() {__PERFORVNM_HEADER__
      override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          window.setDecorFitsSystemWindows(false)
        } else {
          @Suppress("DEPRECATION")
          window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_LOW_PROFILE
          )
        }

        __PERFORVNM_MULTI_PATH__

        __PERFORVNM_MENU__
      }__PERFORVNM_SCENES__

      private fun scenesToJson(): String {
        var json = "["
  
        for (i in 0 until scenesLength) {
          json += ${visualNovel.optimizations.hashScenesNames ? 'scenes.get(i).toString() + "' : '"\\"" + scenes.get(i) + "\\"'},"
        }
  
        return json.dropLast(1) + "]"
      }
    }
    __PERFORVNM_CLASSES__`, 4
  )

  AndroidVisualNovel.customXML.push({
    path: 'values/strings.xml',
    content: helper.codePrepare(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string name="app_name">${visualNovel.info.name}</string>
      </resources>`, 6
    )
  })

  helper.logOk('Base configuration files and main function coded.', 'Android')
}

/* TODO: Create functions for stopping the music and sound effects */
function finalize() {
  helper.replace('Android', '__PERFORVNM_CODE__', '')

  if (visualNovel.menu.showAchievements) achievements._SetAchievementsMenu()

  let switchesCode = helper.codePrepare(`
    private fun switchScene(${visualNovel.optimizations.hashScenesNames ? 'scene: Int' : 'scene: String'}) {
      when (scene) {`, 2
  )

  let savesSwitchCode = ''

  if (AndroidVisualNovel.scenes.length) {
    let scenesCode = ''

    AndroidVisualNovel.scenes.forEach((scene, i) => {
      savesSwitchCode += helper.sceneEach(scene)

      if (scene.next) {
        const nextScene = AndroidVisualNovel.scenes.find((nScene) => nScene.name == scene.next.scene)
        const finishScene = []

        if (scene.next.item?.require?.fallback) {
          const fallbackScene = AndroidVisualNovel.scenes.find((fScene) => fScene.name == scene.next.item.require.fallback)
          const functionParams = []

          if (fallbackScene.speech && !scene.speech) {
            functionParams.push('true')
          }
          if (fallbackScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
            functionParams.push('true')
          }

          scene.code = scene.code.replace('__PERFORVNM_FALLBACK_SCENE_PARAMS__', functionParams.join(', '))
        }

        if (scene.subScenes.length == 0) {
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

          const functionParams = []
          if (nextScene.speech && i != AndroidVisualNovel.scenes.length - 2) functionParams.push('true')
          if (nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name && i + 1 != AndroidVisualNovel.scenes.length - 1) functionParams.push('true')

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

                  ${nextScene.name}(${functionParams.join(', ')})
                }

                override fun onAnimationRepeat(animation: Animation?) {}
              })\n`, 8
            )
          } else {
            code += helper.codePrepare(`
              scenes.set(scenesLength, ${helper.getSceneId(scene.name)})
              scenesLength++

              ${nextScene.name}(${functionParams.join(', ')})\n`, 8
            )
          }

          code += helper.codePrepare('}', 0, 4, false)

          scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}__`, code)
        } else {
          const subScene1 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[0].scene)
          const subScene2 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[1].scene)

          if (!subScene1 || !subScene2)
            helper.logFatal('A subscene does not exist.')

          subScene1.parent = scene.name
          subScene2.parent = scene.name

          const subFunctionParams = []
          if (!scene.speech && subScene1.speech) {
            subFunctionParams.push('true')
          }
          if (subScene1.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
            subFunctionParams.push('true')
          }

          const subFunctionParams2 = []
          if (subScene2.speech && !scene.speech) {
            subFunctionParams2.push('true')
          }
          if (subScene2.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
            subFunctionParams2.push('true')
          }

          scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_1__', `${subScene1.name}(${subFunctionParams.join(', ')})`)
          scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_2__', `${subScene2.name}(${subFunctionParams2.join(', ')})`)

          scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}__`, '')
        }

        const functionParams2 = { function: [], switch: [] }
        if (scene.speech) {
          functionParams2.function.push('animate: Boolean')
          functionParams2.switch.push('true')
        }
        if (nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
          functionParams2.function.push('animateAuthor: Boolean')
          functionParams2.switch.push('true')
        }

        const functionParams = []
        if (scene.speech && !nextScene.speech) {
          functionParams.push('true')
        }
        if (scene.speech?.author?.name && nextScene.speech && !nextScene.speech?.author?.name) {
          functionParams.push('true')
        }

        switchesCode += '\n' + helper.codePrepare(`${helper.getSceneId(scene.name)} -> ${scene.name}(${functionParams2.switch.join(', ').replace(/true/g, 'false')})`, 0, 6, false)

        scene.code = scene.code.replace('__PERFORVNM_SCENE_PARAMS__', functionParams2.function.join(', '))
        scene.code = scene.code.replace('__PERFORVNM_NEXT_SCENE_PARAMS__', functionParams.join(', '))

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
            }\n`, 8, 0, false
          )

          scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
        }
      } else {
        const oldScene = AndroidVisualNovel.scenes[i - 1]

        const functionParams = { function: [], switch: [] }
        if (scene.speech && !oldScene.speech) {
          functionParams.function.push('animate: Boolean')
          functionParams.switch.push('true')
        }
        if (scene.speech?.author?.name && oldScene.speech && !oldScene.speech?.author?.name) {
          functionParams.function.push('animateAuthor: Boolean')
          functionParams.switch.push('true')
        }

        if (scene.subScenes.length != 0) {
          const subScene1 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[0].scene)
          const subScene2 = AndroidVisualNovel.subScenes.find(subScene => subScene.name == scene.subScenes[1].scene)

          if (!subScene1 || !subScene2)
            helper.logFatal('A subscene does not exist.')

          subScene1.parent = scene.name
          subScene2.parent = scene.name

          const subFunctionParams = { function: [], switch: [] }
          if (subScene1.speech && !scene.speech) {
            subFunctionParams.switch.push('true')
          }
          if (subScene1.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
            subFunctionParams.switch.push('true')
          }

          const subFunctionParams2 = { function: [], switch: [] }
          if (subScene2.speech && !scene.speech) {
            subFunctionParams2.switch.push('true')
          }
          if (subScene2.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
            subFunctionParams2.switch.push('true')
          }

          scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_1__', `${subScene1.name}(${subFunctionParams.switch.join(', ')})`)
          scene.code = scene.code.replace('__PERFORVNM_SUBSCENE_2__', `${subScene2.name}(${subFunctionParams2.switch.join(', ')})`)
        }

        switchesCode += '\n' + helper.codePrepare(`${helper.getSceneId(scene.name)} -> ${scene.name}(${functionParams.switch.join(', ').replace(/true/g, 'false')})`, 0, 6, false)

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
            }, textSpeed)\n`, 8, 0, false
          )

          scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
        }
      }

      scenesCode += '\n\n' + scene.code
    })

    AndroidVisualNovel.subScenes.forEach((scene, i) => {
      savesSwitchCode += helper.sceneEach(scene)

      if (scene.next.scene) {
        const nextScene = AndroidVisualNovel.scenes.find((nScene) => nScene.name == scene.next.scene)

        if (!nextScene)
          helper.logFatal('Next scene does not exist.')

        const finishScene = []

        if (scene.effect || scene.music) {
          finishScene.push(
            helper.codePrepare(`
              if (mediaPlayer != null) {
                mediaPlayer!!.stop()
                mediaPlayer!!.release()
                mediaPlayer = null
              }\n`, 12
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
              }\n`, 12
            )
          )
        }

        if (scene.speech || (scene.effect && scene.effect.delay != 0) || (scene.music && scene.music.delay != 0))
          finishScene.push(helper.codePrepare('handler.removeCallbacksAndMessages(null)', 0, 12, false))

        if (i == AndroidVisualNovel.subScenes.length - 2)
          finishScene.push(helper.codePrepare('findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)', 0, 12, false))

        finishScene.push(helper.codePrepare('it.setOnClickListener(null)', 0, 12, false))

        let code = '\n\n' + helper.codePrepare(`
          findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
${finishScene.join('\n')}\n\n`, 6, 0)

        const functionParams = []
        if (nextScene.speech && i != AndroidVisualNovel.subScenes.length - 2) functionParams.push('true')
        if (nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name && i + 1 != AndroidVisualNovel.scenes.length - 1) functionParams.push('true')

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
                ${nextScene.name}(${functionParams.join(', ')})
              }

              override fun onAnimationRepeat(animation: Animation?) {}
            })\n`, 8
          )
        } else {
          code += helper.codePrepare(`${nextScene.name}(${functionParams.join(', ')})\n`, 0, 6, false)
        }

        code += helper.codePrepare('}', 0, 4, false)

        scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}__`, code)

        const functionParams2 = { function: [], switch: [] }
        if (scene.speech) {
          functionParams2.function.push('animate: Boolean')
          functionParams2.switch.push('true')
        }
        if (nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
          functionParams2.function.push('animateAuthor: Boolean')
          functionParams2.switch.push('true')
        }

        scene.code = scene.code.replace('__PERFORVNM_NEXT_SCENE_PARAMS__', functionParams2.switch.join(', '))
        switchesCode += '\n' + helper.codePrepare(`${helper.getSceneId(scene.name)} -> ${scene.name}(${functionParams2.switch.join(', ').replace(/true/g, 'false')})`, 0, 6, false)

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
            }\n`, 8, 0, false
          )

          scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
        }
      } else {
        const oldScene = AndroidVisualNovel.scenes.find((pScene) => pScene.name == scene.parent)

        if (!oldScene)
          helper.logFatal('Parent scene does not exist.')

        const functionParams = { function: [], switch: [] }
        if (scene.speech && !oldScene.speech) {
          functionParams.function.push('animate: Boolean')
          functionParams.switch.push('true')
        }
        if (scene.speech?.author?.name && oldScene.speech && !oldScene.speech?.author?.name) {
          functionParams.function.push('animateAuthor: Boolean')
          functionParams.switch.push('true')
        }

        switchesCode += '\n' + helper.codePrepare(`${helper.getSceneId(scene.name)} -> ${scene.name}(${functionParams.switch.join(', ').replace(/true/g, 'false')})`, 0, 6, false)

        scene.code = scene.code.replace(`__PERFORVNM_SCENE_${scene.name.toUpperCase()}`, '')
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
            }, textSpeed)\n`, 8, 0, false
          )

          scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
        }
      }

      scenesCode += '\n\n' + scene.code
    })

    helper.replace('Android', '__PERFORVNM_SCENES__', `${scenesCode}__PERFORVNM_SCENES__`)
  }

  switchesCode += helper.codePrepare(`
      }
    }`, 2, 0, false
  )

  helper.writeFunction('Android', switchesCode)

  if (visualNovel.achievements.length != 0)
    helper.writeFunction('Android', achievements._AchievementGive())

  if (visualNovel.items.length != 0) {
    helper.writeFunction('Android', _ItemsParsingFunction())

    helper.replace('Android', '__PERFORVNM_ITEMS_RESTORE__', _ItemsRestore())
    helper.replace('Android', /__PERFORVNM_ITEMS_SAVER__/g, _ItemsSaver())
  } else {
    helper.replace('Android', '__PERFORVNM_ITEMS_RESTORE__', '')
    helper.replace('Android', /__PERFORVNM_ITEMS_SAVER__/g, '')
  }

  helper.replace('Android', '__PERFORVNM_SCENES__', '')
  helper.replace('Android', '__PERFORVNM_MENU__', '// No menu created.')
  helper.replace('Android', '__PERFORVNM_CLASSES__', '')
  helper.replace('Android', '__PERFORVNM_MULTI_PATH__', AndroidVisualNovel.scenes.length != 0 ? `scenes.set(0, ${helper.getSceneId(AndroidVisualNovel.scenes[0].name)})` : '// No scenes created.')
  if (!visualNovel.optimizations.preCalculateRounding) {
    const defaultSaveSwitchCode = helper.codePrepare(`
      when (characterData.getJSONObject("position").getString("sideType")) {
        "left" -> {
          val leftDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

          layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
        }
        "leftTop" -> {
          val leftDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))
          val topDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("top") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

          layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad + topDpCharacter, 0, 0)
        }
        "right" -> {
          val rightDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

          layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad, 0, 0)
        }
        "rightTop" -> {
          val rightDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))
          val topDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("top") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

          layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad + topDpCharacter, 0, 0)
        }
        "top" -> {
          val topDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_\${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

          layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad + topDpCharacter, 0, 0)
        }
        "center" -> {
          layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad, 0, 0)
        }
      }`, 0, 2)

    helper.replace('Android', '__PERFORVNM_SAVES_SWITCH__', defaultSaveSwitchCode)
    helper.replace('Android', '__PERFORVNM_HEADERS__', '\nimport kotlin.math.roundToInt')
  } else {
    helper.replace('Android', '__PERFORVNM_SAVES_SWITCH__', helper.sceneEachFinalize(savesSwitchCode))
  }

  helper.replace('Android', '__PERFORVNM_HEADERS__', '')

  if (visualNovel.menu) {
    let menuCode = 'buttonStart.setOnClickListener {\n'
    let releaseCode = ''

    if (visualNovel.menu.background.music) {
      menuCode += helper.codePrepare(`
        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }\n\n`, 2
      )

      releaseCode = helper.codePrepare(`
        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }`
      )
    } else {
      releaseCode = '// No music to release.'
    }

    menuCode += helper.codePrepare(`
        ${AndroidVisualNovel.scenes.length != 0 ? `${AndroidVisualNovel.scenes[0].name}(${(AndroidVisualNovel.scenes[0].speech ? 'true' : '')})` : '// No scenes created.'}
      }`, 2
    )

    helper.replace('Android', /__PERFORVNM_MENU_START__/g, menuCode)
    helper.replace('Android', /__PERFORVNM_RELEASE_MEDIA_PLAYER__/g, releaseCode)
  }

  helper.replace('Android', /__PERFORVNM_SCENES_LENGTH__/g, AndroidVisualNovel.scenes.length + AndroidVisualNovel.subScenes.length)

  let addHeaders = helper.codePrepare(`
    private var scenes = MutableList<${visualNovel.optimizations.hashScenesNames ? 'Int' : 'String'}>(${AndroidVisualNovel.scenes.length + AndroidVisualNovel.subScenes.length}) { ${visualNovel.optimizations.hashScenesNames ? '0' : '""'} }
    private var scenesLength = 1\n`, 2
  )

  if (visualNovel.items.length != 0)
    addHeaders += helper.codePrepare(`
      private var items = MutableList<${visualNovel.optimizations.hashItemsId ? 'Int' : 'String'}>(${visualNovel.items.length}) { ${visualNovel.optimizations.hashItemsId ? '0' : '""'} }
      private var itemsLength = 0\n`, 4)

  if (AndroidVisualNovel.internalInfo.hasSpeech || AndroidVisualNovel.internalInfo.hasDelayedSoundEffect || AndroidVisualNovel.internalInfo.hasEffect || AndroidVisualNovel.internalInfo.hasDelayedMusic || AndroidVisualNovel.internalInfo.hasDelayedAnimation)
    addHeaders += helper.codePrepare('private val handler = Handler(Looper.getMainLooper())\n', 0, 2, false)

  if (visualNovel.menu || AndroidVisualNovel.internalInfo.hasSpeech)
    addHeaders += helper.codePrepare(`private var textSpeed = ${visualNovel.menu?.textSpeed || 1000}L\n`, 0, 2, false)

  if (visualNovel.menu || AndroidVisualNovel.internalInfo.hasEffect)
    addHeaders += helper.codePrepare('private var sEffectVolume = 1f\n', 0, 2, false)

  if (visualNovel.menu || AndroidVisualNovel.internalInfo.hasSceneMusic)
    addHeaders += helper.codePrepare('private var sceneMusicVolume = 1f\n', 0, 2, false)

  if (AndroidVisualNovel.internalInfo.needs2Players)
    addHeaders += helper.codePrepare('private var mediaPlayer2: MediaPlayer? = null\n', 0, 2, false)

  if (AndroidVisualNovel.internalInfo.menuMusic || AndroidVisualNovel.internalInfo.hasEffect || AndroidVisualNovel.internalInfo.hasSpeech || AndroidVisualNovel.internalInfo.hasSceneMusic) {
    if (visualNovel.menu?.backgroundMusic || AndroidVisualNovel.internalInfo.hasEffect) {
      addHeaders += helper.codePrepare(`
        private var mediaPlayer: MediaPlayer? = null

        override fun onPause() {
          super.onPause()

          mediaPlayer?.pause()\n`, 6
      )

      if (AndroidVisualNovel.internalInfo.needs2Players) {
        addHeaders += helper.codePrepare('mediaPlayer2?.pause()\n', 0, 4, false)
      }

      addHeaders += helper.codePrepare(`
        }

        override fun onResume() {
          super.onResume()

          if (mediaPlayer != null) {
            mediaPlayer!!.seekTo(mediaPlayer!!.getCurrentPosition())
            mediaPlayer!!.start()
          }\n`, 6
      )

      if (AndroidVisualNovel.internalInfo.needs2Players) {
        addHeaders += helper.codePrepare(`
          if (mediaPlayer2 != null) {
            mediaPlayer2!!.seekTo(mediaPlayer2!!.getCurrentPosition())
            mediaPlayer2!!.start()
          }`, 4, 0, false
        )
      }

      addHeaders += helper.codePrepare('}\n\n', 0, 2, false)
    } else {
      addHeaders += '\n'
    }

    addHeaders += helper.codePrepare(`
      override fun onDestroy() {
        super.onDestroy()`, 4
    )

    if (AndroidVisualNovel.internalInfo.hasSpeech || AndroidVisualNovel.internalInfo.hasEffect) {
      addHeaders += '\n\n' + helper.codePrepare('handler.removeCallbacksAndMessages(null)', 0, 4, false)
    }

    if (visualNovel.menu?.backgroundMusic || AndroidVisualNovel.internalInfo.hasEffect) {
      addHeaders += helper.codePrepare(`

        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }`, 4, 0, false
      )
    }

    if (AndroidVisualNovel.internalInfo.needs2Players) {
      addHeaders += helper.codePrepare(`

        if (mediaPlayer2 != null) {
          mediaPlayer2!!.stop()
          mediaPlayer2!!.release()
          mediaPlayer2 = null
        }`, 4, 0, false
      )
    }

    addHeaders += '\n' + helper.codePrepare('}\n', 0, 2, false)
  }

  helper.replace('Android', '__PERFORVNM_HEADER__', addHeaders ? '\n' + addHeaders : '')

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

  helper.replace('Android', /__PERFORVNM_START_MUSIC__/g, startMusicCode)

  if (visualNovel.optimizations.minify) AndroidVisualNovel.code = helper.removeAllDoubleLines(AndroidVisualNovel.code)

  helper.logOk('Code finished up.', 'Android')

  let finished = [ false, false ]

  fs.writeFile(`${visualNovel.info.paths.android}/app/src/main/java/com/${visualNovel.info.name.toLowerCase()}/MainActivity.kt`, AndroidVisualNovel.code, (err) => {
    if (err) return helper.logFatal(err)

    helper.logOk('Visual Novel output code written.', 'Android')

    finished[0] = true

    helper.lastMessage(finished)
  })

  let i = 0, j = AndroidVisualNovel.customXML.length - 1
  while (AndroidVisualNovel.customXML.length > 0) {
    const customXML = AndroidVisualNovel.customXML.shift()

    fs.writeFile(`${visualNovel.info.paths.android}/app/src/main/res/${customXML.path}`, customXML.content, (err) => {
      if (err) return helper.logFatal(err)

      helper.logOk(`Android custom XML (${customXML.path}) written.`, 'Android')

      if (i++ == j) {
        finished[1] = true

        helper.lastMessage(finished)
      }
    })
  }
}

export default {
  init,
  finalize
}
