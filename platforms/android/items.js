/* TODO: Cross-saves items */
/* TODO: Option for scenes to require an item and if not, fallback to another scene */

import helper from '../main/helper.js'

function give(page, itemId) {
  page.items.give.push(itemId)

  return page
}

export function _ItemGive(item) {
  return helper.codePrepare(`
    if (!items.contains(${helper.getItemId(item)})) {
      items.set(itemsLength, ${helper.getItemId(item)})
      itemsLength++
    }\n\n`)
}

export function _ItemRemove(item) {
  return helper.codePrepare(`
    if (items.contains(${helper.getItemId(item)})) {
      items.remove(${helper.getItemId(item)})
      itemsLength--
    }`, 0, 6)
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
  give
}