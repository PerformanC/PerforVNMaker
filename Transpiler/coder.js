import fs from 'fs'

global.visualNovel = { code: '', scenes: [] }
global.SPACE = '            '
global.firstWrite = false

function init(name, applicationId) {
  console.log('Starting VN, writing main page.. (Android)')

  visualNovel.code = 'package ' + applicationId + '\n\n' +

  'import android.os.Bundle' + '\n' +
  'import android.widget.ImageView' + '\n' +
  'import android.widget.FrameLayout' + '\n' +
  'import android.widget.Button' + '\n' +
  'import android.widget.Toast' + '\n' +
  'import android.view.ViewGroup.LayoutParams' + '\n' +
  'import androidx.activity.ComponentActivity' + '\n' +
  'import androidx.activity.compose.setContent' + '\n' +
  'import androidx.compose.foundation.layout.fillMaxSize' + '\n' +
  'import androidx.compose.material3.MaterialTheme' + '\n' +
  'import androidx.compose.material3.Surface' + '\n' +
  'import androidx.compose.material3.Text' + '\n' +
  'import androidx.compose.runtime.Composable' + '\n' +
  'import androidx.compose.ui.Modifier' + '\n' +
  'import androidx.compose.ui.tooling.preview.Preview' + '\n' +
  'import ' + applicationId + '.ui.theme.' + name + 'Theme' + '\n\n' +

  'class MainActivity : ComponentActivity() {' + '\n' +
  '  override fun onCreate(savedInstanceState: Bundle?) {' + '\n' +
  '    super.onCreate(savedInstanceState)' + '\n' +
  '      setContent {' + '\n' +
  '        ' + name + 'Theme {' + '\n' +
  '          Surface(' + '\n' +
  '            modifier = Modifier.fillMaxSize(),' + '\n' +
  '            color = MaterialTheme.colorScheme.background' + '\n' +
  '          ) {__PERFORVNM_CODE__' + '\n' +
  '          }' + '\n' +
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