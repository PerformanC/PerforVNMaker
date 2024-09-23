import fs from 'fs'

import helper from '../main/helper.js'

import setConfigs from './helpers/configs.js'

global.FlutterVisualNovel = {
  generatedCodeVersion: 'v1.0.0',
  menu: null,
  internalInfo: {},
  code: '',
  scenes: {},
  subScenes: {},
  achievements: [],
  items: [],
  customXML: [],
  switchScene: [],
  savesWhen: []
}

function init(options) {
  helper.logOk('Starting VN building.', 'Flutter')

  FlutterVisualNovel.code
}

function finalize() {
  /* INFO: Move assets from PerforVNM assets folder to Flutter assets folder */
  helper.logOk('Moving assets to Flutter assets folder.', 'Flutter')

  fs.readdirSync(`${visualNovel.info.paths.assets}`).forEach((file) => {
    fs.copyFileSync(`${visualNovel.info.paths.assets}/${file}`, `${visualNovel.info.paths.flutter}/assets/${file}`)
  })

  helper.logOk('Assets moved.', 'Flutter')

  /* INFO: Generate Flutter code */
  helper.logOk('Setting configurations for project.', 'Flutter')

  setConfigs()

  helper.logOk('Flutter VN building finished.', 'Flutter')
}

export default {
  init,
  finalize
}
