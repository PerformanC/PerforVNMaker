import androidAchievements from '../android/achievements.js'

import helper from './helper.js'

function init(options) {
  const checks = {
    'id': {
      type: 'string',
      extraVerification: (param) => {
        if (visualNovel.achievements.find((achievement) => achievement.id == param))
          helper.logFatal('An achievement already exists with this id.')
      }
    },
    'name': {
      type: 'string',
      extraVerification: (param) => {
        if (visualNovel.achievements.find((achievement) => achievement.name == param))
          helper.logFatal('An achievement already exists with this name.')
      }
    },
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    }
  }

  helper.verifyParams(checks, options)

  visualNovel.achievements = options || []
}

function give(page, achievementId) {
  if (!visualNovel.achievements.find((achievement) => achievement.id == achievementId))
  helper.logFatal(`The achievement '${achievementId}' doesn't exist.`)

  if (page.achievements.find((achievement) => achievement.id == achievementId))
    helper.logFatal(`The achievement '${achievementId}' was already given.`)

  return androidAchievements.give(page, achievementId)
}

export default {
  init,
  give
}