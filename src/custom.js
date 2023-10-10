import helper from './helper.js'

function addCustomText(menu, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'color': {
      type: 'string'
    },
    'fontSize': {
      type: 'number'
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
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
          }
        }
      }
    }
  }
  
  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'text',
    ...options
  })

  return menu
}

function addCustomButton(menu, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'color': {
      type: 'string'
    },
    'fontSize': {
      type: 'number'
    },
    'height': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
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
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'button',
    ...options
  })

  return menu
}

function addCustomRectangle(menu, options) {
  const checks = {
    'color': {
      type: 'string'
    },
    'opacity': {
      type: 'number',
      min: 0,
      max: 1
    },
    'height': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
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
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'rectangle',
    ...options
  })

  return menu
}

function addCustomImage(menu, options) {
  const checks = {
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'height': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
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
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'image',
    ...options
  })

  return menu
}

export default {
  addCustomText,
  addCustomButton,
  addCustomRectangle,
  addCustomImage
}