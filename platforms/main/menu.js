import androdMenu from '../android/menu.js'

import helper from './helper.js'

function init(options) {
  const checks = {
    'textColor': {
      type: 'string'
    },
    'backTextColor': {
      type: 'string'
    },
    'textSpeed': {
      type: 'number'
    },
    'aboutText': {
      type: 'string'
    },
    'seekBar': {
      type: 'object',
      params: {
        'backgroundColor': {
          type: 'string'
        },
        'progressColor': {
          type: 'string'
        },
        'thumbColor': {
          type: 'string'
        }
      }
    },
    'background': {
      type: 'object',
      params: {
        'image': {
          type: 'string'
        },
        'music': {
          type: 'string',
          required: false
        }
      }
    },
    'footer': {
      type: 'object',
      params: {
        'color': {
          type: 'string'
        },
        'textColor': {
          type: 'string'
        },
        'opacity': {
          type: 'number',
          min: 0,
          max: 1
        }
      }
    },
    'showAchievements': {
      type: 'boolean'
    }
  }

  helper.verifyParams(checks, options)

  return androdMenu.init(options)
}

function finalize(menu) {
  visualNovel.menu = menu

  return androdMenu.finalize(menu)
}

export default {
  init,
  finalize
}