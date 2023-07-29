import fs from 'fs'

global.visualNovel = { menu: null, info: {}, code: '', scenes: [] }
global.PerforVNM = {
  version: '1.4.2-beta',
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
  'import android.media.MediaPlayer' + '\n' +
  'import android.widget.TextView' + '\n' +
  'import android.widget.ImageView' + '\n' +
  'import android.widget.FrameLayout' + '\n' +
  'import android.widget.Button' + '\n' +
  'import android.view.View' + '\n' +
  'import android.view.Gravity' + '\n' +
  'import android.view.ViewGroup.LayoutParams' + '\n' +
  'import android.view.animation.Animation' + '\n' +
  'import android.view.animation.LinearInterpolator' + '\n' +
  'import android.view.animation.AlphaAnimation' + '\n' +
  'import android.view.animation.AnimationUtils' + '\n' +
  'import android.view.WindowManager' + '\n' +
  'import android.graphics.PorterDuff' + '\n' +
  'import android.graphics.Paint' + '\n' +
  'import android.graphics.Canvas' + '\n' +
  'import android.content.Context' + '\n' +
  'import androidx.activity.ComponentActivity' + '\n' +
  'import androidx.activity.compose.setContent' + '\n\n' +

  'class MainActivity : ComponentActivity() {__PERFORVNM_HEADER__' + '\n' +
  '  override fun onCreate(savedInstanceState: Bundle?) {' + '\n' +
  '    super.onCreate(savedInstanceState)' + '\n' +
  '      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)' + '\n' +
  '        window.attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES' + '\n\n' +
  '      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {' + '\n' +
  '        window.setDecorFitsSystemWindows(false)' + '\n' +
  '      } else {' + '\n' +
  '        @Suppress("DEPRECATION")' + '\n' +
  '        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or' + '\n' +
  '          View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or' + '\n' +
  '          View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION' + '\n' +
  '      }' + '\n\n' +

  '      setContent {' + '\n' +
  '        __PERFORVNM_MENU__' + '\n' +
  '      }' + '\n' +
  '  }' + '__PERFORVNM_SCENES__' + '\n' +
  '}' + '\n' +
  '__PERFORVNM_CLASSES__'

  console.log('Main coded. (Android)')
}

function finalize() {
  console.log('Finalizing VN, finishing up code.. (Android)')

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_CODE__', '')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENES__', '')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENE_' + visualNovel.scenes[visualNovel.scenes.length - 1].name.toUpperCase() + '__', '')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_MENU__', '// No menu created.')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_CLASSES__', '')
  visualNovel.code = visualNovel.code.replace(/__PERFORVNM_FIRST_SCENE__/g, '// No scene created.')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_STOP_LISTERNING__', '\n\n      it.setOnClickListener(null)')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_HEADER__', '')

  console.log('Code finished up, writing to file.. (Android)')

  fs.writeFile(`../android/app/src/main/java/com/${visualNovel.info.name.toLowerCase()}/MainActivity.kt`, visualNovel.code, (err) => {
    if (err) return console.error(`ERROR: ${err} (Android)`)

    console.log('VN in Kotlin written, writing other configurations.. (Android)')

    fs.writeFile(`../android/app/src/main/res/values/strings.xml`, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="app_name">${visualNovel.info.name}</string>\n</resources>`, (err) => {
      if (err) return console.error(`ERROR: ${err} (Android)`)

      console.log('Android app configuration files written, ready to build. (Android)')
    })
  })
}

export default {
  init,
  finalize
}