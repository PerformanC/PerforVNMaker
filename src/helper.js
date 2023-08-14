function writeScene(sceneCode) {
  const writenCode = '\n\n' + sceneCode + '__PERFORVNM_SCENES__'

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

function lastMessage(finished) {
  if (!finished[0] || !finished[1]) return;

  console.log('\n\n\u001b[34mOK\u001b[0m: The visual novel has been successfully generated. If you liked our work, please give us a star in our repository.')
}

export default {
  writeScene,
  replace,
  makeLog,
  logFatal,
  logOk,
  lastMessage
}
