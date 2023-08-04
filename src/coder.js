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

  if (!options?.name) {
    console.log('ERROR: No name provided.')

    process.exit(1)
  }

  if (!options.fullName) {
    console.log('ERROR: No fullName provided.')

    process.exit(1)
  }

  if (!options.version) {
    console.log('ERROR: No version provided.')

    process.exit(1)
  }

  if (!options.applicationId) {
    console.log('ERROR: No applicationId provided.')

    process.exit(1)
  }

  visualNovel.info = options

  visualNovel.code = 'package ' + options.applicationId + '\n\n' +

  'import android.os.Build' + '\n' +
  'import android.os.Bundle' + '\n' +
  'import android.os.Handler' + '\n' +
  'import android.os.Looper' + '\n' +
  'import android.util.DisplayMetrics' + '\n' +
  'import android.util.TypedValue' + '\n' +
  'import android.media.MediaPlayer' + '\n' +
  'import android.widget.TextView' + '\n' +
  'import android.widget.ImageView' + '\n' +
  'import android.widget.FrameLayout' + '\n' +
  'import android.widget.FrameLayout.LayoutParams' + '\n' +
  'import android.widget.Button' + '\n' +
  'import android.widget.SeekBar' + '\n' +
  'import android.view.View' + '\n' +
  'import android.view.Gravity' + '\n' +
  'import android.view.WindowInsets' + '\n' +
  'import android.view.WindowManager' + '\n' +
  'import android.view.animation.Animation' + '\n' +
  'import android.view.animation.LinearInterpolator' + '\n' +
  'import android.view.animation.OvershootInterpolator' + '\n' +
  'import android.view.animation.AlphaAnimation' + '\n' +
  'import android.animation.Animator' + '\n' +
  'import android.animation.ValueAnimator' + '\n' +
  'import android.text.TextUtils' + '\n' +
  'import android.text.SpannableStringBuilder' + '\n' +
  'import android.text.style.ClickableSpan' + '\n' +
  'import android.text.method.LinkMovementMethod' + '\n' +
  'import android.graphics.PorterDuff' + '\n' +
  'import android.graphics.Paint' + '\n' +
  'import android.graphics.Canvas' + '\n' +
  'import android.content.Context' + '\n' +
  'import android.content.SharedPreferences' + '\n' +
  'import androidx.activity.ComponentActivity' + '\n' +
  'import androidx.activity.compose.setContent' + '\n\n' +

  'class MainActivity : ComponentActivity() {__PERFORVNM_HEADER__' + '\n' +
  '  override fun onCreate(savedInstanceState: Bundle?) {' + '\n' +
  '    super.onCreate(savedInstanceState)' + '\n\n' +

  '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)' + '\n' +
  '      window.attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES' + '\n\n' +

  '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {' + '\n' +
  '      window.setDecorFitsSystemWindows(false)' + '\n\n' +

  '      window.decorView.windowInsetsController?.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())' + '\n\n' +

  '      val windowMetrics = windowManager.currentWindowMetrics' + '\n' +
  '      displayMetrics.widthPixels = windowMetrics.bounds.width()' + '\n' +
  '      displayMetrics.heightPixels = windowMetrics.bounds.height()' + '\n' +
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
  '      )' + '\n\n' +

  '      @Suppress("DEPRECATION")' + '\n' +
  '      windowManager.defaultDisplay.getMetrics(displayMetrics)' + '\n' +
  '    }' + '\n\n' +

  '    setContent {' + '\n' +
  '      __PERFORVNM_MENU__' + '\n' +
  '    }' + '\n' +
  '  }' + '__PERFORVNM_SCENES__' + '\n' +
  '}' + '\n' +
  '__PERFORVNM_CLASSES__'

  console.log('Main coded. (Android)')
}

function finalize() {
  console.log('Finalizing VN, finishing up code.. (Android)')

  helper.replace('__PERFORVNM_CODE__', '')

  if (visualNovel.scenes.length) {
    let scenesCode = []
    let i = 0

    for (const scene of visualNovel.scenes) {
      if (i != visualNovel.scenes.length - 1) {
        const nextScene = visualNovel.scenes[i + 1]
        const finishScene = []

        if ((scene.effect && !scene.music) || (scene.effect && scene.music)) {
          finishScene.push('      if (mediaPlayer != null) {' + '\n' +
                           '        mediaPlayer!!.stop()' + '\n' +
                           '        mediaPlayer!!.release()' + '\n' +
                           '        mediaPlayer = null' + '\n' +
                           '      }' + '\n')
        }
      
        if (scene.effect && scene.music) {
          finishScene.push('      if (mediaPlayer != null) {' + '\n' +
                           '        mediaPlayer!!.stop()' + '\n' +
                           '        mediaPlayer!!.release()' + '\n' +
                           '        mediaPlayer = null' + '\n' +
                           '      }' + '\n')
      
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

        const functionParams = []
        if (nextScene.speech && !scene.speech) functionParams.push('true')
        if (visualNovel.scenes.length != 0 && nextScene.speech?.author?.name && scene.speech && !scene.speech?.author?.name) functionParams.push('true')

        const code = '\n\n' + '    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {' + '\n' +
                     finishScene.join('\n') + '\n\n' +

                     (scene.speech && !nextScene.speech ? '      val animationRectangleSpeech = AlphaAnimation(' + scene.speech.text.rectangle.opacity + 'f, 0f)' + '\n' +
                                                          '      animationRectangleSpeech.duration = 500' + '\n' +
                                                          '      animationRectangleSpeech.interpolator = LinearInterpolator()' + '\n' +
                                                          '      animationRectangleSpeech.fillAfter = true' + '\n\n' +

                                                          '      rectangleViewSpeech.startAnimation(animationRectangleSpeech)' + '\n\n' +

                                                          '      val animationTextSpeech = AlphaAnimation(1f, 0f)' + '\n' +
                                                          '      animationTextSpeech.duration = 500' + '\n' +
                                                          '      animationTextSpeech.interpolator = LinearInterpolator()' + '\n' +
                                                          '      animationTextSpeech.fillAfter = true' + '\n\n' +

                                                          '      textViewSpeech.startAnimation(animationTextSpeech)' + '\n\n' +

                                                          '      val animationAuthorSpeech = AlphaAnimation(' + scene.speech.author.rectangle.opacity + 'f, 0f)' + '\n' +
                                                          '      animationAuthorSpeech.duration = 500' + '\n' +
                                                          '      animationAuthorSpeech.interpolator = LinearInterpolator()' + '\n' +
                                                          '      animationAuthorSpeech.fillAfter = true' + '\n\n' +
                                                          
                                                          '      rectangleViewAuthor.startAnimation(animationAuthorSpeech)' + '\n\n' +

                                                          (scene.speech.author?.name ? '      textViewAuthor.startAnimation(animationTextSpeech)' + '\n\n' : '') +

                                                          '      animationAuthorSpeech.setAnimationListener(object : Animation.AnimationListener {' + '\n' +
                                                          '        override fun onAnimationStart(animation: Animation?) {}' + '\n\n' +

                                                          '        override fun onAnimationEnd(animation: Animation?) {' + '\n' +
                                                          '          ' + nextScene.name + '(' + functionParams.join(', ') + ')' + '\n' +
                                                          '        }' + '\n\n' +

                                                          '        override fun onAnimationRepeat(animation: Animation?) {}' + '\n' +
                                                          '      })' + '\n' : '      ' + nextScene.name + '(' + functionParams.join(', ') + ')' + '\n') +
                     '    }'

       scene.code = scene.code.replace('__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__', code)
      } else scene.code = scene.code.replace('__PERFORVNM_SCENE_' + scene.name.toUpperCase() + '__', '')

      scenesCode.push('\n\n' + scene.code)

      i++
    }

    helper.replace('__PERFORVNM_SCENES__', scenesCode.join(''))
  } else helper.replace('__PERFORVNM_SCENES__', '')

  helper.replace('__PERFORVNM_MENU__', '// No menu created.')
  helper.replace('__PERFORVNM_CLASSES__', '')

  if (visualNovel.menu) {
    const menuCode = 'buttonStart.setOnClickListener {' + '\n' +
                      (visualNovel.menu.options.background.music ? '      if (mediaPlayer != null) {' + '\n' +
                      '        mediaPlayer!!.stop()' + '\n' +
                      '        mediaPlayer!!.release()' + '\n' +
                      '        mediaPlayer = null' + '\n' +
                      '      }' + '\n\n' : '') +

                      '      ' + (visualNovel.scenes.length != 0 ? visualNovel.scenes[0].name + '(' + (visualNovel.scenes[0].speech ? 'true' : '') + ')' + '\n' : '      // No scenes created.' + '\n') +
                      '    }'

    helper.replace(/__PERFORVNM_MENU_START__/g, menuCode)
  }

  let addHeaders = ''
  if (visualNovel.internalInfo.hasSpeech || visualNovel.internalInfo.hasEffect || visualNovel.internalInfo.SceneMusic)
    addHeaders += '  private val handler = Handler(Looper.getMainLooper())' + '\n'

  if (visualNovel.menu || visualNovel.internalInfo.hasSpeech)
    addHeaders += '  private var textSpeed = ' + (visualNovel.menu?.textSpeed || 1000) + 'L' + '\n'

  if (visualNovel.menu || visualNovel.internalInfo.hasEffect)
    addHeaders += '  private var sEffectVolume = 1f' + '\n'

  if (visualNovel.menu || visualNovel.internalInfo.hasSceneMusic)
    addHeaders += '  private var sceneMusicVolume = 1f' + '\n'

  if (visualNovel.internalInfo.needs2Players)
    addHeaders += '  private var mediaPlayer2: MediaPlayer? = null' + '\n'

  if (visualNovel.menu || visualNovel.scenes.length != 0)
    addHeaders += '  private val displayMetrics = DisplayMetrics()' + '\n'

  if (visualNovel.internalInfo.menuMusic || visualNovel.internalInfo.hasEffect || visualNovel.internalInfo.hasSpeech || visualNovel.internalInfo.hasSceneMusic) {
    addHeaders += (visualNovel.menu?.backgroundMusic || visualNovel.internalInfo.hasEffect ? '  private var mediaPlayer: MediaPlayer? = null' + '\n\n' +

                  '  override fun onPause() {' + '\n' +
                  '    super.onPause()' + '\n\n' +

                  '    mediaPlayer?.pause()' + '\n' +

                  (visualNovel.internalInfo.needs2Players ? '    mediaPlayer2?.pause()' + '\n' : '') +

                  '  }' + '\n\n' +

                  '  override fun onResume() {' + '\n' +
                  '    super.onResume()' + '\n\n' +

                  '    if (mediaPlayer != null) {' + '\n' +
                  '      mediaPlayer!!.seekTo(mediaPlayer!!.getCurrentPosition())' + '\n' +
                  '      mediaPlayer!!.start()' + '\n' +
                  '    }' + '\n' +

                  (visualNovel.internalInfo.needs2Players ? '\n' +
                  '    if (mediaPlayer2 != null) {' + '\n' +
                  '      mediaPlayer2!!.seekTo(mediaPlayer2!!.getCurrentPosition())' + '\n' +
                  '      mediaPlayer2!!.start()' + '\n' +
                  '    }' : '') +

                  '  }' + '\n\n' : '\n') +
                  '  override fun onDestroy() {' + '\n' +
                  '    super.onDestroy()' + '\n\n' +

                  (visualNovel.internalInfo.hasSpeech || visualNovel.internalInfo.hasEffect  ? '    handler.removeCallbacksAndMessages(null)' + (visualNovel.menu?.backgroundMusic || visualNovel.internalInfo.hasEffect || visualNovel.internalInfo.needs2Players ? '\n\n' : '') : '') +

                  (visualNovel.menu?.backgroundMusic || visualNovel.internalInfo.hasEffect ? '    if (mediaPlayer != null) {' + '\n' +
                  '      mediaPlayer!!.stop()' + '\n' +
                  '      mediaPlayer!!.release()' + '\n' +
                  '      mediaPlayer = null' + '\n' +
                  '    }' : '') + (visualNovel.internalInfo.needs2Players ? '\n\n' : '') +

                  (visualNovel.internalInfo.needs2Players ? '\n' +
                  '    if (mediaPlayer2 != null) {' + '\n' +
                  '      mediaPlayer2!!.stop()' + '\n' +
                  '      mediaPlayer2!!.release()' + '\n' +
                  '      mediaPlayer2 = null' + '\n' +
                  '    }' + '\n' : '\n') +
                  '  }' + '\n'
  }

  helper.replace('__PERFORVNM_HEADER__', addHeaders ? '\n' + addHeaders : '')

  const startMusicCode = '\n' + '      mediaPlayer = MediaPlayer.create(this, R.raw.' + visualNovel.menu?.backgroundMusic + ')' + '\n\n' +

                         '      if (mediaPlayer != null) {' + '\n' +
                         '        mediaPlayer!!.start()' + '\n\n' +

                         '        val volume = getSharedPreferences("PerforVNM", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)' + '\n' +
                         '        mediaPlayer!!.setVolume(volume, volume)' + '\n\n' +

                         '        mediaPlayer!!.setOnCompletionListener {' + '\n' +
                         '          mediaPlayer!!.start()' + '\n' +
                         '        }' + '\n' +
                         '      }'

  helper.replace(/__PERFORVNM_START_MUSIC__/g, startMusicCode)

  console.log('Code finished up, writing to file.. (Android)')

  fs.writeFile(`../android/app/src/main/java/com/${visualNovel.info.name.toLowerCase()}/MainActivity.kt`, visualNovel.code, (err) => {
    if (err) return console.error(`ERROR: ${err} (Android)`)

    console.log('VN in Kotlin written, writing other configurations.. (Android)')

    fs.writeFile(`../android/app/src/main/res/values/strings.xml`, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="app_name">${visualNovel.info.name}</string>\n</resources>`, (err) => {
      if (err) return console.error(`ERROR: ${err} (Android)`)

      console.log('Android app configuration files written, ready to build. (Android)')
    })
  })

  while (visualNovel.customXML.length > 0) {
    const customXML = visualNovel.customXML.shift()

    fs.writeFile(`../android/app/src/main/res/${customXML.path}`, customXML.content, (err) => {
      if (err) return console.error(`ERROR: ${err} (Android)`)
    })
  }

  fs.readFile('package.json', 'utf8', (err, data) => {
    if (err) return console.error(`ERROR: ${err} (Android)`)

    fs.writeFile('package.json', data.replace(/"version": ".*"/g, `"version": "${PerforVNM.codeGeneratorVersion}"`), (err) => {
      if (err) return console.error(`ERROR: ${err} (Android)`)
    })
  })
}

export default {
  init,
  finalize
}