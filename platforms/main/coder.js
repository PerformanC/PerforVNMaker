import androidCoder from '../android/coder.js'

global.visualNovel = {
  info: null,
  menu: null,
  scenes: {},
  scenesLength: 0,
  subScenes: {},
  subScenesLength: 0,
  achievements: [],
  items: [],
  optimizations: {},
  hashes: {
    scenes: {},
    achievements: {},
    items: {}
  },
  finalized: false
}
global.PerforVNM = {
  codeGeneratorVersion: '2.0.0',
  generatedCodeVersion: '1.21.1',
  repository: 'https://github.com/PerformanC/PerforVNMaker'
}

import helper from './helper.js'

function init(options) {
  if (visualNovel.info)
    helper.logFatal('The visual novel is already initialized.')

  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'name': {
      type: 'string'
    },
    'fullName': {
      type: 'string'
    },
    'version': {
      type: 'string'
    },
    'applicationId': {
      type: 'string'
    },
    'paths': {
      type: 'object',
      params: {
        'android': {
          type: 'string'
        }
      }
    },
    'optimizations': {
      type: 'object',
      params: {
        'reuseResources': {
          type: 'boolean',
          required: false
        },
        'hashScenesNames': {
          type: 'boolean',
          required: false
        },
        'hashAchievementIds': {
          type: 'boolean',
          required: false
        },
        'hashItemsId': {
          type: 'boolean',
          required: false
        },
        'preCalculateRounding': {
          type: 'boolean',
          required: false
        },
        'preCalculateScenesInfo': {
          type: 'boolean',
          required: false
        },
        'minify': {
          type: 'boolean',
          required: false
        }
      },
      required: true
    }
  }

  helper.verifyParams(checks, options)

  visualNovel.info = options
  if (options.optimizations) visualNovel.optimizations = options.optimizations

  androidCoder.init(options)
}

function finalize() {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  visualNovel.finalized = true

  androidCoder.finalize()
}

export default {
  init,
  finalize
}