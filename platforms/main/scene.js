import androidScene from '../android/scene.js'
import flutterScene from '../flutter/scene.js'

import helper from './helper.js'

function init(options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'name': {
      type: 'string',
      notValues: ['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'],
      extraVerification: (param) => {
        if (visualNovel.scenes[param] || visualNovel.subScenes[param])
          helper.logFatal('A scene already exists with this name.')

        if (visualNovel.optimizations.hashAchievementIds && visualNovel.hashes.scenes[helper.hash(param)])
          helper.logFatal('Collision found with another scene name. Change the name of the scene.')
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

  const sceneModel = androidScene.init(options)
  flutterScene.init(options)

  return sceneModel
}

function addCharacter(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

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
            return additionalinfo.parent?.[additionalinfo.index]?.type == 'movement'
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
            return additionalinfo.parent?.[additionalinfo.index]?.type == 'movement'
          },
          required: false
        },
        'degrees': {
          type: 'number',
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent?.[additionalinfo.index]?.type == 'rotate'
          }
        },
        'scale': {
          type: 'number',
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent?.[additionalinfo.index]?.type == 'scale'
          }
        },
        'duration': {
          type: 'number',
          shouldCheck: (_param, additionalinfo) => {
            return additionalinfo.parent?.[additionalinfo.index]?.type != 'jump'
          }
        },
        'delay': {
          type: 'number',
          required: false
        }
      },
      extraVerification: (param) => {
        if (param.delay != 0) {
          AndroidVisualNovel.internalInfo.hasDelayedAnimation = true
          FlutterVisualNovel.internalInfo.hasDelayedAnimation = true
        }
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  androidScene.addCharacter(scene, options)
  flutterScene.addCharacter(scene, options)

  return scene
}

function addScenario(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    }
  }

  helper.verifyParams(checks, options)

  androidScene.addScenario(scene, options)
  flutterScene.addScenario(scene, options)

  return scene
}

function addSpeech(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

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

  androidScene.addSpeech(scene, options)
  flutterScene.addSpeech(scene, options)

  return scene
}

function addSoundEffects(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

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
        if (param != 0) {
          AndroidVisualNovel.internalInfo.hasDelayedSoundEffect = true
          FlutterVisualNovel.internalInfo.hasDelayedSoundEffect = true
        }
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  androidScene.addSoundEffects(scene, options)
  flutterScene.addSoundEffects(scene, options)

  return scene
}

function addMusic(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'music': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'delay': {
      type: 'number',
      extraVerification: (param) => {
        if (param != 0) {
          AndroidVisualNovel.internalInfo.hasDelayedMusic = true
          FlutterVisualNovel.internalInfo.hasDelayedMusic = true
        }
      },
      required: false
    }
  }

  helper.verifyParams(checks, options)

  androidScene.addMusic(scene, options)
  flutterScene.addMusic(scene, options)

  return scene
}

function addTransition(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'duration': {
      type: 'number'
    }
  }

  helper.verifyParams(checks, options)

  androidScene.addTransition(scene, options)
  flutterScene.addTransition(scene, options)

  return scene
}

function setNextScene(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

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

  androidScene.setNextScene(scene, options)
  flutterScene.setNextScene(scene, options)

  return scene
}

function addSubScenes(scene, options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

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

  androidScene.addSubScenes(scene, options)
  flutterScene.addSubScenes(scene, options)

  return scene
}

function finalize(scene) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

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