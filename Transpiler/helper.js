function writeLine(line) {
  const writenCode = (firstWrite ? '\n\n' : '\n') + '          ' + line + '__PERFORVNM_CODE__'

  firstWrite = true

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_CODE__', writenCode)
}

function writeScene(sceneCode) {
  const writenCode = '\n\n' + sceneCode + '__PERFORVNM_SCENES__'

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENES__', writenCode)
}

export default {
  writeLine,
  writeScene
}