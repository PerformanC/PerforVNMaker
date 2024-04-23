import androidItems from '../android/items.js'

import helper from './helper.js'

function init(options) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'id': {
      type: 'string',
      extraVerification: (param) => {
        if (visualNovel.items.find((achievement) => achievement.id == param))
          helper.logFatal('An item already exists with this id.')
      }
    },
    'name': {
      type: 'string',
      extraVerification: (param) => {
        if (visualNovel.items.find((item) => item.name == param))
          helper.logFatal('An item already exists with this name.')

        if (visualNovel.optimizations.hashAchievementIds && visualNovel.hashes.items[helper.hash(param)])
          helper.logFatal('Collision found with another item name. Change the name of the item.')
      }
    }
  }

  helper.verifyParams(checks, options)

  visualNovel.items = options || []
}

function give(page, itemId) {
  if (visualNovel.finalized)
    helper.logFatal('The visual novel has already been finalized.')

  const checks = {
    'id': {
      type: 'string',
      extraVerification: (param) => {
        if (!visualNovel.items.find((item) => item.id == param))
          helper.logFatal(`The item '${param}' doesn't exist.`)

        if (page.items.give.find((item) => item.id == param))
          helper.logFatal(`The item '${param}' was already given.`)
      }
    }
  }

  helper.verifyParams(checks, { id: itemId })

  return androidItems.give(page, itemId)
}

export default {
  init,
  give
}