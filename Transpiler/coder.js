import fs from 'fs'

global.visualNovel = { code: '', scenes: [] }
global.SPACE = '          '
global.firstWrite = false

function init(name, applicationId) {
  console.log('Starting VN, writing main page.. (Android)')

  visualNovel.code = 'package ' + applicationId + '\n\n' +

  'import android.os.Bundle' + '\n' +
  'import android.widget.ImageView' + '\n' +
  'import android.widget.FrameLayout' + '\n' +
  'import android.widget.Button' + '\n' +
  'import android.os.Build' + '\n' +
  'import android.view.View' + '\n' +
  'import android.view.ViewGroup.LayoutParams' + '\n' +
  'import android.view.WindowManager' + '\n' +
  'import androidx.activity.ComponentActivity' + '\n' +
  'import androidx.activity.compose.setContent' + '\n' +
  'import ' + applicationId + '.ui.theme.' + name + 'Theme' + '\n\n' +

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
  '        ' + name + 'Theme {__PERFORVNM_CODE__' + '\n' +
  '        }' + '\n' +
  '      }' + '\n' +
  '  }' + '__PERFORVNM_SCENES__' + '\n' +
  '}' + '\n'

  console.log('Theme was coded. (Android)')
}

function finalize() {
  console.log('Finalizing VN, writing main page.. (Android)')

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_CODE__', '')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENES__', '')
  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENE_' + visualNovel.scenes[visualNovel.scenes.length - 1].name.toUpperCase() + '__', '')

  fs.writeFile('vn.kt', visualNovel.code, function (err) {
    if (err) return console.log(err);
    console.log('Main page written successfully. (Android)');
  })

  console.log('VN was coded. (Android)')
}

export default {
  init,
  finalize
}