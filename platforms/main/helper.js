/* TODO: Create helper folder and move functions to there */
/* CRITICAL TODO: Avoid collisions in hash functions */

import fs from 'fs'

function writeFunction(platform, sceneCode) {
  const writenCode = `\n\n${sceneCode}__PERFORVNM_SCENES__`

  switch (platform) {
    case 'Android': AndroidVisualNovel.code = AndroidVisualNovel.code.replace('__PERFORVNM_SCENES__', writenCode); break;
    // case 'iOS': iOSVisualNovel.code = iOSVisualNovel.code.replace('__PERFORVNM_SCENES__', writenCode); break;
    // case 'Web': WebVisualNovel.code = WebVisualNovel.code.replace('__PERFORVNM_SCENES__', writenCode); break;
    // case 'Desktop': DesktopVisualNovel.code = DesktopVisualNovel.code.replace('__PERFORVNM_SCENES__', writenCode); break;
  }
}

function replace(platform, header, content) {
  switch (platform) {
    case 'Android': AndroidVisualNovel.code = AndroidVisualNovel.code.replace(header, content); break;
    // case 'iOS': iOSVisualNovel.code = iOSVisualNovel.code.replace(header, content); break;
    // case 'Web': WebVisualNovel.code = WebVisualNovel.code.replace(header, content); break;
    // case 'Desktop': DesktopVisualNovel.code = DesktopVisualNovel.code.replace(header, content); break;
  }
}

function makeLog(message) {
  return `${message}\n` + new Error().stack.replace('Error\n', '\u001b[2m') + '\u001b[0m'
}

function logFatal(message) {
  console.error(`\n\u001b[31mError\u001b[0m: ${makeLog(message)}`)

  process.exit(1)
}

function logOk(message, platform) {
  let platformColor = '\u001b[0m'

  switch (platform) {
    case 'Android':
      platformColor = '\u001b[32m'

      break
  }

  console.log(`\u001b[34mOK ${platformColor}${platform}\u001b[0m: ${message}`)
}

function logWarning(message) {
  console.warn(`\u001b[33mWarning\u001b[0m: ${makeLog(message)}`)
}

function lastMessage(finished) {
  if (!finished[0] || !finished[1]) return;

  console.log('\n\n\u001b[34mOK\u001b[0m: The visual novel has been successfully generated. If you liked our work, please give us a star in our repository.')

  if (visualNovel.optimizations.useIntForSwitch)
    console.log('\n\n\u001b[34mOK\u001b[0m: The "useIntForSwitch" aggressive optimization has been enabled. Saves backward compability are not supported, use only for the final release of the VN.')
}

/*
 * PCTL - PerformanC's Typing Library
 *
 * The function below, called "verifyParams", is licensed under the "PerformanC's Custom License", which can be found in the LICENSE file.
 */
function verifyParams(check, params, additionalinfo = {}) {
  if (params === undefined) {
    logFatal('The parameters object is undefined.')
  }

  if (typeof params != 'object') {
    logFatal('The parameters object must be an object.')
  }

  const isArray = Array.isArray(params)
  if (isArray) {
    params.forEach((item, index) => {
      additionalinfo.parent = params
      additionalinfo.index = index

      verifyParams(check, item, additionalinfo)
    })

    return;
  }

  Object.keys(check).forEach((key) => {
    const checkKey = check[key]

    if (checkKey.shouldCheck && !checkKey.shouldCheck(params[key], additionalinfo)) return;

    if (checkKey.required != false && params[key] === undefined) {
      logFatal(`The parameter "${key}" is required.`)
    }
  })

  Object.keys(params).forEach((key) => {
    const param = params[key]
    const checkKey = check[key]

    if (!checkKey) {
      logWarning(`Unecessary parameter "${key}".`)

      return;
    }

    if (checkKey.shouldCheck && !checkKey.shouldCheck(param, additionalinfo)) return;

    const type = isArray ? 'array' : typeof param

    if (checkKey.params) {
      if (type != 'object') {
        logFatal(`The parameter "${key}" must be an object or an array.`)
      }

      if (isArray == true && param.length == 0 && checkKey.required == true) {
        logFatal(`The parameter "${key}" must not be empty.`)
      }

      additionalinfo.parent = params

      verifyParams(checkKey.params, param, additionalinfo)
    }

    switch (checkKey.type) {
      case 'file': {
        try {
          fs.accessSync((checkKey.basePath || './') + param, fs.constants.F_OK)
        } catch {
          logFatal(`The file "${param}" does not exist.`)
        }

        break
      }
      case 'fileInitial': {
        try {
          if (!fs.readdirSync((checkKey.basePath || './')).find((file) => {
            return file.startsWith(param)
          })) {
            logFatal(`The file "${param}" does not exist.`)
          }
        } catch {
          logFatal(`The file "${param}" does not exist.`)
        }

        break
      }
      default: {
        if (!checkKey.type.includes(Array.isArray(param) ? 'array' : typeof param)) {
          logFatal(`The parameter "${key}" must be a ${checkKey.type}.`)
        }
      }
    }

    if ((checkKey.shouldCheckValues ? checkKey.shouldCheckValues(param, additionalinfo) : 'true') && checkKey.values) {
      if (!checkKey.values.includes(param)) {
        logFatal(`The parameter "${key}" must be one of the following values: ${checkKey.values.join(', ')}.`)
      }
    }

    if ((checkKey.shouldCheckNotValues ? checkKey.shouldCheckNotValues(param, additionalinfo) : true) && checkKey.notValues) {
      if (checkKey.notValues.includes(param)) {
        logFatal(`The parameter "${key}" must not be one of the following values: ${checkKey.notValues.join(', ')}.`)
      }
    }
  
    if (checkKey.min !== undefined && param < checkKey.min) {
      logFatal(`The parameter "${key}" must be greater than or equal to ${checkKey.min}.`)
    }

    if (checkKey.max !== undefined && param > checkKey.max) {
      logFatal(`The parameter "${key}" must be less than or equal to ${checkKey.max}.`)
    }

    if (checkKey.extraVerification) {
      checkKey.extraVerification(param, additionalinfo)
    }
  })
}

function codePrepare(code, removeSpaceAmount = 0, addSpaceAmount = 0, removeFirstLine = true) {
  const lines = code.split('\n')

  if (removeFirstLine) lines.shift()

  let addedSpaces = ''
  for (let i = 0; i < addSpaceAmount; i++) {
    addedSpaces += ' '
  }

  lines.forEach((line, index) => {
    if (line == '') return;

    if (visualNovel.optimizations.minify) {
      lines[index] = line.trim()

      return;
    }

    lines[index] = addedSpaces + line.substring(removeSpaceAmount)
  })

  return lines.join('\n')
}

function addResource(page, resource) {
  if (page.resources[`${resource.dp}${resource.type}`]) return page

  page.resources = {
    ...page.resources,
    [`${resource.dp}${resource.type}`]: {
      type: resource.type,
      dp: resource.dp,
      spaces: resource.spaces,
      ...(resource.newLines ? { newLines: resource.newLines } : {})
    }
  }

  return page
}

function getResource(page, resource) {
  const cResource = page.resources[`${resource.dp}${resource.type}`]

  if (resource.type == 'sdp') {
    if (!visualNovel.optimizations.reuseResources) return {
      definition: null,
      inlined: `resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${resource.dp}${resource.type})`,
      variable: `resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${resource.dp}${resource.type})`,
      additionalSpace: '\n'
    }

    if (cResource) return {
      definition: null,
      inlined: `__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`,
      variable: `__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`,
      additionalSpace: '\n'
    }
    else {
      return {
        definition: `__PERFORVNM_${resource.dp}_${resource.type}_DEFINE__`,
        inlined: `__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`,
        variable: `__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`,
        additionalSpace: '\n\n'
      }
    }
  } else if (resource.type == 'ssp') {
    if (!visualNovel.optimizations.reuseResources) return {
      definition: null,
      inlined: `resources.getDimension(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`,
      variable: `resources.getDimension(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`,
      additionalSpace: '\n'
    }

    if (cResource) return {
      definition: null,
      inlined: `__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`,
      variable: `__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`,
      additionalSpace: '\n'
    }
    else {
      return {
        definition: `__PERFORVNM_${resource.dp}_${resource.type}_DEFINE__`,
        inlined: `__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`,
        variable: `__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`,
        additionalSpace: '\n\n'
      }
    }
  }
}

function getMultipleResources(page, page2, resource) {
  let cResource = null

  cResource = getResource(page, resource)
  if (cResource.definition) cResource = getResource(page2, resource)

  return cResource
}

function finalizeResources(page, code) {
  Object.keys(page.resources).forEach((key) => {
    const resource = page.resources[key]

    const defineRegex = new RegExp(`__PERFORVNM_${resource.dp}_${resource.type}_DEFINE__`, 'g')
    const inlineRegex = new RegExp(`__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`, 'g')
    const variableRegex = new RegExp(`__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`, 'g')

    const variableAmount = code.split(variableRegex).length - 1

    if (variableAmount == 1) {
      code = code.replace(defineRegex, '')

      if (resource.type == 'sdp') {
        code = code.replace(variableRegex, `resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${resource.dp}${resource.type})`)
      } else {
        code = code.replace(variableRegex, `resources.getDimension(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`)
      }
    }

    let spaces = ''
    for (let i = 0; i < resource.spaces; i++) {
      spaces += ' '
    }

    if (resource.type == 'sdp') {
      code = code.replace(defineRegex, `val ${resource.type}${resource.dp} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${resource.dp}${resource.type})${resource.newLines ? resource.newLines : '\n\n'}${spaces}`)
      code = code.replace(inlineRegex, `resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${resource.dp}${resource.type})`)
      code = code.replace(variableRegex, `${resource.type}${resource.dp}`)
    } else {
      code = code.replace(defineRegex, `val ${resource.type}${resource.dp} = resources.getDimension(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})${resource.newLines ? resource.newLines : '\n\n'}${spaces}`)
      code = code.replace(inlineRegex, `resources.getDimension(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`)
      code = code.replace(variableRegex, `${resource.type}${resource.dp}`)
    }
  })

  return code
}

function finalizeMultipleResources(page, page2, code) {
  code = finalizeResources(page, code)
  code = finalizeResources(page2, code)

  return code
}

function hash(str) {
  let hash = 0, i = 0

  while (str.length > i) hash = hash * 37 + (str.charCodeAt(i++) & 255)

  return hash % 2147483647 /* Kotlin Int max value */
}

function getSceneId(scene) {
  if (visualNovel.optimizations.hashScenesNames) return hash(scene)
  else return `"${scene}"`
}

function getAchievementId(achievement, parsed) {
  if (visualNovel.optimizations.hashAchievementIds) return hash(achievement)
  else {
    if (parsed) return `\\"${achievement}\\"`
    else return `"${achievement}"`
  }
}

function getItemId(item) {
  if (visualNovel.optimizations.hashItemsId) return hash(item)
  else return `"${item}"`
}

function removeAllDoubleLines(code) {
  switch (process.platform) {
    case 'win32':
      return code.replace(/\r\n\r\n/g, '\r\n')
    default:
      return code.replace(/\n\n/g, '\n')
  }
}


function sceneEach(scene) {
  let savesSwitchLocal = codePrepare(`
    ${getSceneId(scene.name)} -> {
      when (characterData.getString("name")) {`, 0, 6, false
  )

  scene.characters.forEach((character) => {
    let optimizedSetImage = ''
    if (visualNovel.optimizations.preCalculateScenesInfo) {
      optimizedSetImage = codePrepare(`
        imageViewCharacter.setImageResource(R.raw.${character.image})\n\n                    `, 8
      )
    }
    switch (character.position.side) {
      case 'left': {
        savesSwitchLocal += codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'leftTop': {
        savesSwitchLocal += codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)
            val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.top * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'right': {
        savesSwitchLocal += codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val rightDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'rightTop': {
        savesSwitchLocal += codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val rightDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)
            val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.top * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'top': {
        savesSwitchLocal += codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'center': {
        savesSwitchLocal += codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
    }
  })

  return savesSwitchLocal + '\n' + codePrepare('}\n', 0, 12, false) + codePrepare('}', 0, 10, false)
}

function sceneEachFinalize(savesSwitchCode) {
  return codePrepare(`
    when (buttonData.get${visualNovel.optimizations.hashScenesNames ? 'Int' : 'String'}("scene")) {`, 0, 4
  ) + savesSwitchCode + '\n' + 
  codePrepare('}', 0, 8, false)
}

export default {
  writeFunction,
  replace,
  makeLog,
  logFatal,
  logOk,
  logWarning,
  lastMessage,
  verifyParams,
  codePrepare,
  addResource,
  getResource,
  getMultipleResources,
  finalizeResources,
  finalizeMultipleResources,
  hash,
  getSceneId,
  getAchievementId,
  getItemId,
  removeAllDoubleLines,
  sceneEach,
  sceneEachFinalize
}
