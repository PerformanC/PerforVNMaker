import androidScene from '../android/scene.js'

import helper from './helper.js'

function init(options) {
  const checks = {
    'name': {
      type: 'string',
      notValues: ['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'],
      extraVerification: (param) => {
        if (visualNovel.scenes[param] || visualNovel.subScenes[param])
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

  return androidScene.init(options)
}

function addCharacter(scene, options) {
  const checks = {
    'name': {
      type: 'string',
      extraVerification: (param) => {
        if (scene.characters.find(character => character.name == param))
          helper.logFatal('A character already exists with this name.')
      }
    },
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: ['center', 'left', 'right']
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          },
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent.position.side != 'center'
          }
        }
      }
    },
    'animations': {
      type: 'array',
      params: {
        'type': {
          type: 'string',
          values: ['movement', 'jump', 'fadeIn', 'fadeOut', 'rotate', 'scale']
        },
        'side': {
          type: 'string',
          values: ['center', 'left', 'right'],
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type == 'movement'
          }
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          },
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type == 'movement'
          },
          required: false
        },
        'degrees': {
          type: 'number',
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type == 'rotate'
          }
        },
        'scale': {
          type: 'number',
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type == 'scale'
          }
        },
        'duration': {
          type: 'number',
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent[additionalinfo.index].type != 'jump'
          }
        },
        'delay': {
          type: 'number',
          required: false
        }
      },
      extraVerification: (param) => {
        if (param.delay != 0)
          AndroidVisualNovel.internalInfo.hasDelayedAnimation = true
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addCharacter(scene, options)
}

function addScenario(scene, options) {
  const checks = {
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addScenario(scene, options)
}

function addSpeech(scene, options) {
  const checks = {
    'author': {
      type: 'object',
      params: {
        'name': {
          type: 'string'
        },
        'textColor': {
          type: 'string'
        },
        'rectangle': {
          type: 'object',
          params: {
            'color': {
              type: 'string'
            },
            'opacity': {
              type: 'number'
            }
          }
        }
      }
    },
    'text': {
      type: 'object',
      params: {
        'content': {
          type: 'string'
        },
        'color': {
          type: 'string'
        },
        'fontSize': {
          type: 'number'
        },
        'rectangle': {
          type: 'object',
          params: {
            'color': {
              type: 'string'
            },
            'opacity': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addSpeech(scene, options)
}

function addSoundEffects(scene, options) {
  if (!Array.isArray(options))
    helper.logFatal('Sound effects must be an array.')

  const checks = {
    'sound': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'delay': {
      type: 'number',
      extraVerification: (param) => {
        if (param != 0)
          AndroidVisualNovel.internalInfo.hasDelayedSoundEffect = true
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addSoundEffects(scene, options)
}

function addMusic(scene, options) {
  const checks = {
    'music': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'delay': {
      type: 'number',
      extraVerification: (param) => {
        if (param != 0)
          AndroidVisualNovel.internalInfo.hasDelayedMusic = true
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addMusic(scene, options)
}

function addTransition(scene, options) {
  const checks = {
    'duration': {
      type: 'number'
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addTransition(scene, options)
}

function setNextScene(scene, options) {
  const checks = {
    'scene': {
      type: 'string'
    },
    'item': {
      type: 'object',
      required: false,
      params: {
        'require': {
          type: 'object',
          params: {
            'id': {
              type: 'string',
              extraVerification: (param) => {
                if (!visualNovel.items.find((item) => item.id == param))
                  helper.logFatal(`The item '${param}' doesn't exist.`)
              }
            },
            'fallback': {
              type: 'string',
            }
          }
        },
        'remove': {
          type: 'boolean',
          required: false,
          extraVerification: (param, additionalinfo) => {
            if (param && !additionalinfo.parent?.require?.id)
              helper.logFatal('You must specify an item to be removed once used.')
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.setNextScene(scene, options)
}

function addSubScenes(scene, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'item': {
      type: 'object',
      required: false,
      params: {
        'require': {
          type: 'string',
          extraVerification: (param) => {
            if (!visualNovel.items.find((item) => item.id == param))
              helper.logFatal(`The item '${param}' doesn't exist.`)
          }
        },
        'remove': {
          type: 'boolean',
          required: false,
          extraVerification: (param, additionalinfo) => {
            if (param && !additionalinfo.parent?.item?.require)
              helper.logFatal('You must specify an item to be removed once used.')
          }
        }
      }
    },
    'scene': {
      type: 'string',
      extraVerification: (param) => {
        if (visualNovel.subScenes[param])
          helper.logFatal('A sub-scene already exists with this name.')
      }
    }
  }

  helper.verifyParams(checks, options)

  return androidScene.addSubScenes(scene, options)
}

function finalize(scene) {
  if (scene.type == 'normal') {
    visualNovel.scenes[scene.name] = scene

    visualNovel.scenesLength++
  } else {
    visualNovel.subScenes[scene.name] = scene

    visualNovel.subScenesLength++
  }
}

export default {
  init,
  addCharacter,
  addScenario,
  addSpeech,
  addSoundEffects,
  addMusic,
  addTransition,
  setNextScene,
  addSubScenes,
  finalize
}