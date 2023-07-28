function writeScene(sceneCode) {
  const writenCode = '\n\n' + sceneCode + '__PERFORVNM_SCENES__'

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_SCENES__', writenCode)
}

export default {
  writeScene
}