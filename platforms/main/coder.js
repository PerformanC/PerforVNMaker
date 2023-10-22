import androidCoder from '../android/coder.js'

global.visualNovel = { info: null, achievements: [], items: [], optimizations: {} }

import helper from './helper.js'

function init(options) {
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
  androidCoder.finalize()
}

export default {
  init,
  finalize
}