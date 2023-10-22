/* TODO: Items searchs from O(n) to O(1) through objects */
/* TODO: Cross-saves items */
/* TODO: Option for scenes to require an item and if not, fallback to another scene */

import helper from './helper.js'

export function init(options) {
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
      }
    }
  }

  helper.verifyParams(checks, options)

  visualNovel.items = options || []
}

export function give(page, itemId) {
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

  page.items.give.push(itemId)

  return page
}

export function _ItemGive(item) {
  return helper.codePrepare(`
    items.set(itemsLength, ${helper.getItemId(item)})
    itemsLength++\n\n`)
}

export function _ItemRemove(item) {
  return helper.codePrepare(`
    items.set(itemsLength, ${visualNovel.optimizations.hashItemsId ? '0' : '""'})
    itemsLength--`, 0, 6)
}

export function _ItemsParsingFunction() {
  return helper.codePrepare(`
    private fun itemsToJson(): String {
      var json = "["

      for (i in 0 until itemsLength) {
        json += ${visualNovel.optimizations.hashItemsId ? 'items.get(i).toString() + "' : '"\\"" + items.get(i) + "\\"'},"
      }

      return json.dropLast(1) + "]"
    }`, 2)
}

export function _ItemsRestore() {
  return helper.codePrepare(`\n
    val sceneItems = buttonData.getJSONArray("items")
    for (j in 0 until sceneItems.length()) {
      items.set(j, sceneItems.getInt(j))
    }
    itemsLength = sceneItems.length()`, 0, 4, false)
}

export function _ItemsSaver() {
  return helper.codePrepare(` ",\\"items\\":" + itemsToJson() + `, 0, 0, false)
}

export default {
  init,
  give
}