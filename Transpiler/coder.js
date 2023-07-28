import fs from 'fs'

global.visualNovel = { code: '', scenes: [] }
global.PerforVNM = {
  version: '1.0.2-alpha',
  repository: 'https://github.com/PerformanC/PerforVNMaker'
}

function init(options) {
  console.log('Starting VN, coding main code.. (Android)')

  visualNovel.code = 'package ' + options.applicationId + '\n\n' +

  'import android.os.Build' + '\n' +
  'import android.os.Bundle' + '\n' +
  'import android.widget.TextView' + '\n' +
  'import android.widget.ImageView' + '\n' +
  'import android.widget.FrameLayout' + '\n' +
  'import android.widget.Button' + '\n' +
  'import android.view.View' + '\n' +
  'import android.view.Gravity' + '\n' +
  'import android.view.ViewGroup.LayoutParams' + '\n' +
  'import android.view.WindowManager' + '\n' +
  'import android.graphics.PorterDuff' + '\n' +
  'import android.graphics.Paint' + '\n' +
  'import android.graphics.Canvas' + '\n' +
  'import android.content.Context' + '\n' +
  'import androidx.activity.ComponentActivity' + '\n' +
  'import androidx.activity.compose.setContent' + '\n' +
  'import ' + options.applicationId + '.ui.theme.' + options.name + 'Theme' + '\n\n' +

  'class MainActivity : ComponentActivity() {' + '\n' +
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
  '        ' + options.name + 'Theme {' + '\n' +
  '          __PERFORVNM_MENU__' + '\n' +
  '        }' + '\n' +
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

  console.log('Code finished up, writing to file.. (Android)')

  fs.writeFile('vn.kt', visualNovel.code, function (err) {
    if (err) return console.log(err);
    console.log('VN Kotlin is now available in vn.kt. (Android)');
  })
}

export default {
  init,
  finalize
}