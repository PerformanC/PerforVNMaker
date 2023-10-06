import fs from 'fs'

function writeFunction(sceneCode) {
  const writenCode = `\n\n${sceneCode}__PERFORVNM_SCENES__`

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENES__', writenCode)
}

function replace(header, content) {
  visualNovel.code = visualNovel.code.replace(header, content)
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
  if (page.resources.find((cResource) => resource.dp == cResource.dp && resource.type == cResource.type)) return page

  page.resources.push(resource)

  return page
}

function addMultipleResources(page, page2, resource) {
  addResource(page, resource)
  addResource(page2, resource)
}

function getResource(page, resource) {
  const cResource = page.resources.find((cResource) => resource.dp == cResource.dp && resource.type == cResource.type)

  if (resource.type == 'sdp') {
    if (!visualNovel.optimizations.reuseResources) return {
      definition: null,
      inlined: `resources.getDimensionPixelSize(resources.getIdentifier("_${resource.dp}${resource.type}", "dimen", getPackageName()))`,
      variable: `resources.getDimensionPixelSize(resources.getIdentifier("_${resource.dp}${resource.type}", "dimen", getPackageName()))`,
      additionalSpace: '\n'
    }

    if (cResource) return {
      definition: null,
      inlined: `${cResource.type}${cResource.dp}`,
      variable: `${cResource.type}${cResource.dp}`,
      additionalSpace: '\n'
    }
    else {
      return {
        definition: `val ${resource.type}${resource.dp} = resources.getDimensionPixelSize(resources.getIdentifier("_${resource.dp}${resource.type}", "dimen", getPackageName()))`,
        inlined: `resources.getDimensionPixelSize(resources.getIdentifier("_${resource.dp}${resource.type}", "dimen", getPackageName()))`,
        variable: `${resource.type}${resource.dp}`,
        additionalSpace: '\n\n'
      }
    }
  } else if (resource.type == 'ssp') {
    if (!visualNovel.optimizations.reuseResources) return {
      definition: null,
      inlined: `resources.getDimensionPixelSize(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`,
      variable: `resources.getDimensionPixelSize(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`,
      additionalSpace: '\n'
    }

    if (cResource) return {
      definition: null,
      inlined: `${cResource.type}${cResource.dp}`,
      variable: `${cResource.type}${cResource.dp}`,
      additionalSpace: '\n'
    }
    else {
      return {
        definition: `val ${resource.type}${resource.dp} = resources.getDimension(com.intuit.ssp.R.dimen._${resource.dp}${resource.type})`,
        inlined: `resources.getDimension(com.intuit.ssp.R.dimen.__${resource.dp}${resource.type})`,
        variable: `${resource.type}${resource.dp}`,
        additionalSpace: '\n\n'
      }
    }
  }
}

function getMultipleResources(page, page2, resource) {
  let cResource = null

  cResource = getResource(page, resource)
  if (!cResource.definition) cResource = getResource(page2, resource)

  return cResource
}

function hash(str) {
  let hash = 0, i = 0

  while (str.length > i) hash = hash * 37 + (str.charCodeAt(i++) & 255)

  return hash % 2147483647 /* Kotlin Int max value */
}

function getSceneId(scene) {
  if (visualNovel.optimizations.scenesNameHashing) return hash(scene)
  else `"${scene}"`
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
  addMultipleResources,
  getResource,
  getMultipleResources,
  hash,
  getSceneId
}
