import helper from './helper.js'

function sceneEachInit() {
  return helper.codePrepare(`
    when (buttonData.get${visualNovel.optimizations.hashScenesNames ? 'Int' : 'String'}("scene")) {`, 0, 4
  )
}

function sceneEach(scene) {
  let savesSwitchLocal = helper.codePrepare(`
    ${helper.getSceneId(scene.name)} -> {
      when (characterData.getString("name")) {`, 0, 6, false
  )

  scene.characters.forEach((character) => {
    let optimizedSetImage = ''
    if (visualNovel.optimizations.preCalculateScenesInfo) {
      optimizedSetImage = helper.codePrepare(`
        imageViewCharacter.setImageResource(R.raw.${character.image})\n\n                    `, 8
      )
    }
    switch (character.position.side) {
      case 'left': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'leftTop': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)
            val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.top * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'right': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val rightDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'rightTop': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val rightDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)
            val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.top * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'top': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}val topDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${Math.round(character.position.margins.side * 0.25)}sdp)

            layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad + topDpCharacter, 0, 0)
          }`, 0, 4, false
        )

        break
      }
      case 'center': {
        savesSwitchLocal += helper.codePrepare(`
          "${character.name}" -> {
            ${optimizedSetImage}layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad, 0, 0)
          }`, 0, 4, false
        )

        break
      }
    }
  })

  return savesSwitchLocal + '\n' + helper.codePrepare('}\n', 0, 12, false) + helper.codePrepare('}', 0, 10, false)
}

function sceneEachFinalize(savesSwitchCode) {
  return savesSwitchCode + '\n' + helper.codePrepare('}', 0, 8, false)
}

export default {
  sceneEachInit,
  sceneEach,
  sceneEachFinalize
}