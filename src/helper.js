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

  if (Array.isArray(params)) {
    params.forEach((item) => {
      additionalinfo.parent = params

      verifyParams(check, item, additionalinfo)
    })

    return;
  }

  Object.keys(check).forEach((key) => {
    const checkKey = check[key]

    if (checkKey.shouldCheck && !checkKey.shouldCheck(params[key], additionalinfo)) return;

    if ((checkKey.required === undefined || checkKey.required) && params[key] === undefined) {
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

    let type = typeof param
    let isArray = false
    if (type == 'object' && Array.isArray(param)) {
      isArray = true
      type = 'array'
    }

    if (checkKey.params) {
      if (type != 'object' && isArray == false) {
        logFatal(`The parameter "${key}" must be an object or an array.`)
      }

      if (isArray == true && param.length == 0) {
        logFatal(`The parameter "${key}" must not be empty.`)
      }

      if (type == 'object') {
        additionalinfo.parent = params

        verifyParams(checkKey.params, param, additionalinfo)
      } else {
        param.forEach((item, index) => {
          additionalinfo.parent = params
          additionalinfo.index = index

          verifyParams(checkKey.params, item, additionalinfo)
        })
      }
    }

    if (checkKey.type == 'file') {
      try {
        fs.accessSync((checkKey.basePath || './') + param, fs.constants.F_OK)
      } catch {
        logFatal(`The file "${param}" does not exist.`)
      }
    } else if (checkKey.type == 'fileInitial') {
      try {
        if (!fs.readdirSync((checkKey.basePath || './')).find((file) => {
          return file.startsWith(param)
        })) {
          logFatal(`The file "${param}" does not exist.`)
        }
      } catch {
        logFatal(`The file "${param}" does not exist.`)
      }
    } else {
      if (!checkKey.type.includes(type)) {
        logFatal(`The parameter "${key}" must be a ${checkKey.type}.`)
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

function codePrepare(code, removeSpaceAmount = 0, removeFirstLine = false) {
  const lines = code.split('\n')

  if (removeFirstLine) lines.shift()

  lines.forEach((line, index) => {
    lines[index] = line.substring(removeSpaceAmount)
  })

  return lines.join('\n')
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
  codePrepare
}
