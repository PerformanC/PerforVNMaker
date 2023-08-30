import helper from './helper.js'

function init(options) {
  const checks = {
    'name': {
      type: 'string',
      notValues: ['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'],
      extraVerification: (param) => {
        if (visualNovel.subScenes.find((subScene) => subScene.name == param))
          helper.logFatal('A scene already exists with this name.')
      }
    }
  }

  helper.verifyParams(checks, options)

  return { name: options.name, type: 'subScene', next: null, characters: [], subScenes: [], background: null, speech: null, effect: null, music: null, transition: null, custom: [] }
}

export default {
  init
}