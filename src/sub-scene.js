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

  return {
    name: options.name,
    type: 'subScene',
    options: {
      textColor: options.textColor,
      backTextColor: options.backTextColor,
      buttonsColor: options.buttonsColor,
      footerTextColor: options.footerTextColor
    },
    next: null,
    characters: [],
    subScenes: [],
    background: null,
    speech: null,
    effect: null,
    music: null,
    transition: null,
    achievements: [],
    custom: [],
    resources: []
  }
}

export default {
  init
}