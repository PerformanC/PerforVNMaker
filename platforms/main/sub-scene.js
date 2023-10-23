import androidSubScene from '../android/sub-scene.js'

function init(options) {
  const checks = {
    'name': {
      type: 'string',
      notValues: ['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'],
      extraVerification: (param) => {
        if (AndroidVisualNovel.subScenes.find((subScene) => subScene.name == param))
          helper.logFatal('A scene already exists with this name.')
      }
    },
    'textColor': {
      type: 'string'
    },
    'backTextColor': {
      type: 'string'
    },
    'buttonsColor': {
      type: 'string'
    },
    'footerTextColor': {
      type: 'string'
    }
  }

  helper.verifyParams(checks, options)

  return androidSubScene.init(options)
}

export default {
  init
}