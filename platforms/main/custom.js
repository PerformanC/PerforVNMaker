import helper from './helper.js'

function addCustomText(page, options) {
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

  switch (page?.type) {
    case 'menu': {
      if (!visualNovel.menu)
        helper.logFatal('Menu must be initialized before adding customs to it')

      page = visualNovel.menu

      break
    }
    default: {
      helper.logFatal('Page type is not recognized/supported by customs.')
    }
  }

  page.custom.push({
    type: 'text',
    ...options
  })

  return page
}

function addCustomButton(page, options) {
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

  switch (page.type) {
    case 'menu': {
      if (!visualNovel.menu)
        helper.logFatal('Menu must be initialized before adding customs to it')

      page = visualNovel.menu

      break
    }
  }

  page.custom.push({
    type: 'button',
    ...options
  })

  return page
}

function addCustomRectangle(page, options) {
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

  switch (page.type) {
    case 'menu': {
      if (!visualNovel.menu)
        helper.logFatal('Menu must be initialized before adding customs to it')

      page = visualNovel.menu

      break
    }
  }

  page.custom.push({
    type: 'rectangle',
    ...options
  })

  return page
}

function addCustomImage(page, options) {
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

  switch (page.type) {
    case 'menu': {
      if (!visualNovel.menu)
        helper.logFatal('Menu must be initialized before adding customs to it')

      page = visualNovel.menu

      break
    }
  }

  page.custom.push({
    type: 'image',
    ...options
  })

  return page
}

export default {
  addCustomText,
  addCustomButton,
  addCustomRectangle,
  addCustomImage
}