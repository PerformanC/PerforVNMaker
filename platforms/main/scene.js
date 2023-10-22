import androidScene from '../android/scene.js'

import helper from './helper.js'

function init(options) {
  return androidScene.init(options)
}

function addCharacter(scene, options) {
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

  return androidScene.addSoundEffects(scene, options)
}

function addMusic(scene, options) {
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
  return androidScene.addSubScenes(scene, options)
}

function finalize(scene) {
  return androidScene.finalize(scene)
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