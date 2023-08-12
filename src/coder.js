import fs from 'fs'

import helper from './helper.js'

global.visualNovel = { menu: null, info: null, internalInfo: {}, code: '', scenes: [], customXML: [] }
global.PerforVNM = {
  codeGeneratorVersion: '1.18.2-b.0',
  generatedCodeVersion: '1.16.8-b.0',
  repository: 'https://github.com/PerformanC/PerforVNMaker'
}

function init(options) {
  console.log('Starting VN, coding main code.. (Android)')

  if (!options?.name)
    throw new Error('No name provided.')

  if (!options.fullName)
    throw new Error('No fullName provided.')

  if (!options.version)
    throw new Error('No version provided.')

  if (!options.applicationId)
    throw new Error('No applicationId provided.')

  if (!options.paths?.android)
    throw new Error('No path provided.')

  visualNovel.info = options

  visualNovel.code = 'package ' + options.applicationId + '\n\n' +

  'import java.io.InputStreamReader' + '\n' +
  'import org.json.JSONArray' + '\n' +
  'import kotlin.math.roundToInt' + '\n\n' +

  'import android.os.Build' + '\n' +
  'import android.os.Bundle' + '\n' +
  'import android.os.Handler' + '\n' +
  'import android.os.Looper' + '\n' +
  'import android.app.Activity' + '\n' +
  'import android.util.TypedValue' + '\n' +
  'import android.media.MediaPlayer' + '\n' +
  'import android.widget.TextView' + '\n' +
  'import android.widget.ImageView' + '\n' +
  'import android.widget.ScrollView' + '\n' +
  'import android.widget.FrameLayout' + '\n' +
  'import android.widget.FrameLayout.LayoutParams' + '\n' +
  'import android.widget.Button' + '\n' +
  'import android.widget.SeekBar' + '\n' +
  'import android.view.View' + '\n' +
  'import android.view.Gravity' + '\n' +
  'import android.view.animation.Animation' + '\n' +
  'import android.view.animation.LinearInterpolator' + '\n' +
  'import android.view.animation.OvershootInterpolator' + '\n' +
  'import android.view.animation.AlphaAnimation' + '\n' +
  'import android.animation.Animator' + '\n' +
  'import android.text.TextUtils' + '\n' +
  'import android.text.SpannableStringBuilder' + '\n' +
  'import android.text.style.ClickableSpan' + '\n' +
  'import android.text.method.LinkMovementMethod' + '\n' +
  'import android.graphics.Paint' + '\n' +
  'import android.graphics.Canvas' + '\n' +
  'import android.content.Context' + '\n' +
  'import android.content.SharedPreferences' + '\n\n' +

  'class MainActivity : Activity() {__PERFORVNM_HEADER__' + '\n' +
  '  override fun onCreate(savedInstanceState: Bundle?) {' + '\n' +
  '    super.onCreate(savedInstanceState)' + '\n\n' +

  '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {' + '\n' +
  '      window.setDecorFitsSystemWindows(false)' + '\n' +
  '    } else {' + '\n' +
  '      @Suppress("DEPRECATION")' + '\n' +
  '      window.decorView.systemUiVisibility = (' + '\n' +
  '        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION' + '\n' +
  '        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY' + '\n' +
  '        or View.SYSTEM_UI_FLAG_FULLSCREEN' + '\n' +
  '        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION' + '\n' +
  '        or View.SYSTEM_UI_FLAG_LAYOUT_STABLE' + '\n' +
  '        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN' + '\n' +
  '        or View.SYSTEM_UI_FLAG_LOW_PROFILE' + '\n' +
  '      )' + '\n' +
  '    }' + '\n\n' +

  '    __PERFORVNM_MENU__' + '\n' +
  '  }' + '__PERFORVNM_SCENES__' + '\n' +
  '}' + '\n' +
  '__PERFORVNM_CLASSES__'

  console.log('Main coded. Adding configuration files (Android)')

  visualNovel.customXML.push({
    path: 'values/strings.xml',
    content: '<?xml version="1.0" encoding="utf-8"?>' + '\n' +
             '<resources>' + '\n' +
             `    <string name="app_name">${visualNovel.info.name}</string>` + '\n' +
             '</resources>'
  })
}

function finalize() {
  console.log('Finalizing VN, finishing up code.. (Android)')

  helper.replace('__PERFORVNM_CODE__', '')

  let switchesCode = 'when (buttonData.getString("scene")) {'

  if (visualNovel.scenes.length) {
    let scenesCode = []
    let i = -1

    while (i++ < visualNovel.scenes.length - 1) {
      const scene = visualNovel.scenes[i]

      if (i != visualNovel.scenes.length - 1) {
        const nextScene = visualNovel.scenes[i + 1]
        const finishScene = []

        if (scene.effect || scene.music) {
          finishScene.push('      if (mediaPlayer != null) {' + '\n' +
                           '        mediaPlayer!!.stop()' + '\n' +
                           '        mediaPlayer!!.release()' + '\n' +
                           '        mediaPlayer = null' + '\n' +
                           '      }' + '\n')
        }
      
        if (scene.effect && scene.music) {
          finishScene.push('      if (mediaPlayer2 != null) {' + '\n' +
                           '        mediaPlayer2!!.stop()' + '\n' +
                           '        mediaPlayer2!!.release()' + '\n' +
                           '        mediaPlayer2 = null' + '\n' +
                           '      }' + '\n')
        }

        if (scene.speech || (scene.effect && scene.effect.delay != 0) || (scene.music && scene.music.delay != 0))
          finishScene.push('      handler.removeCallbacksAndMessages(null)')

        if (i == visualNovel.scenes.length - 2)
          finishScene.push('      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)')

        finishScene.push('      it.setOnClickListener(null)')

        let code = '\n\n' + '    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {' + '\n' +
                   finishScene.join('\n') + '\n\n'

        const functionParams = []
        if (nextScene.speech && i + 1 != visualNovel.scenes.length - 1) functionParams.push('true')
        if (nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name && i + 1 != visualNovel.scenes.length - 1) functionParams.push('true')

        if (scene.speech && !nextScene.speech) {
          code += `      val animationRectangleSpeech = AlphaAnimation(${scene.speech.text.rectangle.opacity}f, 0f)` + '\n' +
                  '      animationRectangleSpeech.duration = 500' + '\n' +
                  '      animationRectangleSpeech.interpolator = LinearInterpolator()' + '\n' +
                  '      animationRectangleSpeech.fillAfter = true' + '\n\n' +

                  '      rectangleViewSpeech.startAnimation(animationRectangleSpeech)' + '\n\n' +

                  '      val animationTextSpeech = AlphaAnimation(1f, 0f)' + '\n' +
                  '      animationTextSpeech.duration = 500' + '\n' +
                  '      animationTextSpeech.interpolator = LinearInterpolator()' + '\n' +
                  '      animationTextSpeech.fillAfter = true' + '\n\n' +

                  '      textViewSpeech.startAnimation(animationTextSpeech)' + '\n\n' +

                  `      val animationAuthorSpeech = AlphaAnimation(${scene.speech.author.rectangle.opacity}f, 0f)` + '\n' +
                  '      animationAuthorSpeech.duration = 500' + '\n' +
                  '      animationAuthorSpeech.interpolator = LinearInterpolator()' + '\n' +
                  '      animationAuthorSpeech.fillAfter = true' + '\n\n' +

                  '      rectangleViewAuthor.startAnimation(animationAuthorSpeech)' + '\n\n'

          if (scene.speech.author?.name) {
            code += '      textViewAuthor.startAnimation(animationTextSpeech)' + '\n\n'
          }

          code += '      animationAuthorSpeech.setAnimationListener(object : Animation.AnimationListener {' + '\n' +
                  '        override fun onAnimationStart(animation: Animation?) {}' + '\n\n' +

                  '        override fun onAnimationEnd(animation: Animation?) {' + '\n' +
                  `          ${nextScene.name}(${functionParams.join(', ')})` + '\n' +
                  '        }' + '\n\n' +

                  '        override fun onAnimationRepeat(animation: Animation?) {}' + '\n' +
                  '      })' + '\n'
        } else {
          code += '      ' + nextScene.name + '(' + functionParams.join(', ') + ')' + '\n'
        }

        code += '    }'

        scene.code = scene.code.replace('__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__', code)

        const functionParams2 = { function: [], switch: [] }
        if (scene.speech) {
          functionParams2.function.push('animate: Boolean')
          functionParams2.switch.push('true')
        }
        if (nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name) {
          functionParams2.function.push('animateAuthor: Boolean')
          functionParams2.switch.push('true')
        }

        switchesCode += '\n' + `          "${scene.name}" -> ${scene.name}(${functionParams2.switch.join(', ')})`

        scene.code = scene.code.replace('__PERFORVNM_SCENE_PARAMS__', functionParams2.function.join(', '))

        if (scene.speech) {
          const speechHandler = '\n' + '    if (animate) {' + '\n' +
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
                                '    }' + '\n'

          scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
        }
      } else {
        const oldScene = visualNovel.scenes[i - 1]

        const functionParams = { function: [], switch: [] }
        if (scene.speech && !oldScene.speech) {
          functionParams.function.push('animate: Boolean')
          functionParams.switch.push('true')
        }
        if (scene.speech?.author?.name && oldScene.speech && !oldScene.speech?.author?.name) {
          functionParams.function.push('animateAuthor: Boolean')
          functionParams.switch.push('true')
        }

        switchesCode += '\n' + `          "${scene.name}" -> ${scene.name}(${functionParams.switch.join(', ')})`

        scene.code = scene.code.replace('__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__', '')
        scene.code = scene.code.replace('__PERFORVNM_SCENE_PARAMS__', functionParams.function.join(', '))

        if (scene.speech) {
          const speechHandler = '\n' + '    var i = 0' + '\n\n' +

                                '    handler.postDelayed(object : Runnable {' + '\n' +
                                '      override fun run() {' + '\n' +
                                '        if (i < speechText.length) {' + '\n' +
                                '          textViewSpeech.text = speechText.substring(0, i + 1)' + '\n' +
                                '          i++' + '\n' +
                                '          handler.postDelayed(this, textSpeed)' + '\n' +
                                '        }' + '\n' +
                                '      }' + '\n' +
                                '    }, textSpeed)' + '\n'

          scene.code = scene.code.replace('__PERFORVNM_SPEECH_HANDLER__', speechHandler)
        }
      }

      scenesCode.push('\n\n' + scene.code)
    }

    helper.replace('__PERFORVNM_SCENES__', scenesCode.join(''))
  } else helper.replace('__PERFORVNM_SCENES__', '')

  helper.replace('__PERFORVNM_MENU__', '// No menu created.')
  helper.replace('__PERFORVNM_CLASSES__', '')

  if (visualNovel.menu) {
    let menuCode = 'buttonStart.setOnClickListener {' + '\n'

    if (visualNovel.menu.options.background.music) {
      menuCode += '      if (mediaPlayer != null) {' + '\n' +
                  '        mediaPlayer!!.stop()' + '\n' +
                  '        mediaPlayer!!.release()' + '\n' +
                  '        mediaPlayer = null' + '\n' +
                  '      }' + '\n\n'
    }

    menuCode += `      ${visualNovel.scenes.length != 0 ? visualNovel.scenes[0].name + '(' + (visualNovel.scenes[0].speech ? 'true' : '') + ')' : '      // No scenes created.'}` + '\n' +
                '    }'

    helper.replace(/__PERFORVNM_MENU_START__/g, menuCode)

    let releaseCode;

    if (visualNovel.menu.options.background.music) {
      releaseCode = 'if (mediaPlayer != null) {' + '\n' +
                    '          mediaPlayer!!.stop()' + '\n' +
                    '          mediaPlayer!!.release()' + '\n' +
                    '          mediaPlayer = null' + '\n' +
                    '        }'
    } else releaseCode = '// No music to release.'

    helper.replace(/__PERFORVNM_RELEASE_MEDIA_PLAYER__/g, releaseCode)

    switchesCode += '\n' + '        }'

    helper.replace(/__PERFORVNM_SWITCHES__/g, switchesCode)
  }

  let addHeaders = ''
  if (visualNovel.internalInfo.hasSpeech || visualNovel.internalInfo.hasDelayedSoundEffect || visualNovel.internalInfo.hasEffect || visualNovel.internalInfo.SceneMusic || visualNovel.internalInfo.hasDelayedAnimation)
    addHeaders += '  private val handler = Handler(Looper.getMainLooper())' + '\n'

  if (visualNovel.menu || visualNovel.internalInfo.hasSpeech)
    addHeaders += `  private var textSpeed = ${visualNovel.menu?.textSpeed || 1000}L` + '\n'

  if (visualNovel.menu || visualNovel.internalInfo.hasEffect)
    addHeaders += '  private var sEffectVolume = 1f' + '\n'

  if (visualNovel.menu || visualNovel.internalInfo.hasSceneMusic)
    addHeaders += '  private var sceneMusicVolume = 1f' + '\n'

  if (visualNovel.internalInfo.needs2Players)
    addHeaders += '  private var mediaPlayer2: MediaPlayer? = null' + '\n'

  if (visualNovel.internalInfo.menuMusic || visualNovel.internalInfo.hasEffect || visualNovel.internalInfo.hasSpeech || visualNovel.internalInfo.hasSceneMusic) {
    if (visualNovel.menu?.backgroundMusic || visualNovel.internalInfo.hasEffect) {
      addHeaders += '  private var mediaPlayer: MediaPlayer? = null' + '\n\n' +

                    '  override fun onPause() {' + '\n' +
                    '    super.onPause()' + '\n\n' +

                    '    mediaPlayer?.pause()' + '\n'

      if (visualNovel.internalInfo.needs2Players) {
        addHeaders += '    mediaPlayer2?.pause()' + '\n'
      }

      addHeaders += '  }' + '\n\n' +

                    '  override fun onResume() {' + '\n' +
                    '    super.onResume()' + '\n\n' +

                    '    if (mediaPlayer != null) {' + '\n' +
                    '      mediaPlayer!!.seekTo(mediaPlayer!!.getCurrentPosition())' + '\n' +
                    '      mediaPlayer!!.start()' + '\n' +
                    '    }' + '\n'

      if (visualNovel.internalInfo.needs2Players) {
        addHeaders += '\n' + '    if (mediaPlayer2 != null) {' + '\n' +
                      '      mediaPlayer2!!.seekTo(mediaPlayer2!!.getCurrentPosition())' + '\n' +
                      '      mediaPlayer2!!.start()' + '\n' +
                      '    }'
      }

      addHeaders += '  }' + '\n\n'
    } else {
      addHeaders += '\n'
    }

    addHeaders += '  override fun onDestroy() {' + '\n' +
                  '    super.onDestroy()'

    if (visualNovel.internalInfo.hasSpeech || visualNovel.internalInfo.hasEffect) {
      addHeaders += '\n\n' + '    handler.removeCallbacksAndMessages(null)'
    }

    if (visualNovel.menu?.backgroundMusic || visualNovel.internalInfo.hasEffect) {
      addHeaders += '\n\n' + '    if (mediaPlayer != null) {' + '\n' +
                    '      mediaPlayer!!.stop()' + '\n' +
                    '      mediaPlayer!!.release()' + '\n' +
                    '      mediaPlayer = null' + '\n' +
                    '    }'
    }

    if (visualNovel.internalInfo.needs2Players) {
      addHeaders += '\n\n' + '    if (mediaPlayer2 != null) {' + '\n' +
                    '      mediaPlayer2!!.stop()' + '\n' +
                    '      mediaPlayer2!!.release()' + '\n' +
                    '      mediaPlayer2 = null' + '\n' +
                    '    }'
    }

    addHeaders += '\n' + '  }' + '\n'
  }

  helper.replace('__PERFORVNM_HEADER__', addHeaders ? '\n' + addHeaders : '')

  const startMusicCode = '\n' + `      mediaPlayer = MediaPlayer.create(this, R.raw.${visualNovel.menu?.backgroundMusic})` + '\n\n' +

                         '      if (mediaPlayer != null) {' + '\n' +
                         '        mediaPlayer!!.start()' + '\n\n' +

                         '        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)' + '\n' +
                         '        mediaPlayer!!.setVolume(volume, volume)' + '\n\n' +

                         '        mediaPlayer!!.setOnCompletionListener {' + '\n' +
                         '          mediaPlayer!!.start()' + '\n' +
                         '        }' + '\n' +
                         '      }'

  helper.replace(/__PERFORVNM_START_MUSIC__/g, startMusicCode)

  console.log('Code finished up, writing to file.. (Android)')

  fs.writeFile(`${visualNovel.info.paths.android}/app/src/main/java/com/${visualNovel.info.name.toLowerCase()}/MainActivity.kt`, visualNovel.code, (err) => {
    if (err) return console.error(`ERROR: ${err} (Android)`)

    console.log('VN in Kotlin written. (Android)')
  })

  while (visualNovel.customXML.length > 0) {
    const customXML = visualNovel.customXML.shift()

    fs.writeFile(`${visualNovel.info.paths.android}/app/src/main/res/${customXML.path}`, customXML.content, (err) => {
      if (err) return console.error(`ERROR: ${err} (Android)`)

      console.log(`Android custom XML (${customXML.path}) written. (Android)`)
    })
  }
}

export default {
  init,
  finalize
}
