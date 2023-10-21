/* TODO: Achievements searchs from O(n) to O(1) through objects */
/* TODO: Option for scenes to require an achievement and if not, fallback to another scene */

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

  page.achievements.push({
    id: achievementId
  })

  return page
}

function _AchievementGiveFunction() {
  return helper.codePrepare(`
    private fun giveAchievement(${visualNovel.optimizations.hashAchievementIds ? 'achievement: Int' : 'achievement: String, achievementParsed: String'}) {
      val inputStream = openFileInput("achievements.json")
      var text = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      if (text == "[]") text = "[" + ${visualNovel.optimizations.hashAchievementIds ? 'achievement' : 'achievementParsed'} + "]"
      else {
        val achievementsJson = JSONArray(text)

        for (i in 0 until achievementsJson.length()) {
          if (achievementsJson.get${visualNovel.optimizations.hashAchievementIds ? 'Int' : 'String'}(i) == achievement) return
        }

        text = text.dropLast(1) + ", " + ${visualNovel.optimizations.hashAchievementIds ? 'achievement' : 'achievementParsed'} + "]"
      }

      val outputStream = openFileOutput("achievements.json", Context.MODE_PRIVATE)
      outputStream.write(text.toByteArray())
      outputStream.close()
    }`, 2
  )
}

function _SetAchievementsMenu() {
  const menu = visualNovel.menu

  let achievementsSwitch = helper.codePrepare(`
    when (achievements.get${visualNovel.optimizations.hashAchievementIds ? 'Int' : 'String'}(i)) {
${visualNovel.achievements.map((achievement) => helper.codePrepare(`
      ${helper.getAchievementId(achievement.id)} -> {
        achievement_${achievement.id}.setColorFilter(null)
        achievement_${achievement.id}.setAlpha(1.0f)
      }`)).join('\n')}
    }`, 0, 2
  )

  const sdp300Achievements = helper.getMultipleResources(menu, menu.pages.achievements, { type: 'sdp', dp: '300' })
  menu.pages.achievements = helper.addResource(menu.pages.achievements, { type: 'sdp', dp: '300', spaces: 4 })

  let achievementsView = ''
  if (visualNovel.achievements.length != 0) {
    const sdp100Achievements = helper.getMultipleResources(menu, menu.pages.achievements, { type: 'sdp', dp: '100' })
    menu.pages.achievements = helper.addResource(menu.pages.achievements, { type: 'sdp', dp: '100', spaces: 4 })
  
    const sdp70Achievements = helper.getMultipleResources(menu, menu.pages.achievements, { type: 'sdp', dp: '70' })
    menu.pages.achievements = helper.addResource(menu.pages.achievements, { type: 'sdp', dp: '70', spaces: 0 })

    achievementsView = helper.codePrepare(`\n
      ${sdp100Achievements.definition}${sdp70Achievements.definition}val ColorMatrixAchievements = ColorMatrix()
      ColorMatrixAchievements.setSaturation(0.0f)\n\n`, 2, 0, false
    )

    let leftDp = 120
    let topDp = 50
  
    visualNovel.achievements.forEach((achievement, index) => {
      let customLeftSdpAchievement = helper.getMultipleResources(menu, menu.pages.achievements, { type: 'sdp', dp: leftDp })
      menu.pages.achievements = helper.addResource(menu.pages.achievements, { type: 'sdp', dp: leftDp, spaces: 4 })

      let customTopSdpAchievement = helper.getMultipleResources(menu, menu.pages.achievements, { type: 'sdp', dp: topDp })
      menu.pages.achievements = helper.addResource(menu.pages.achievements, { type: 'sdp', dp: topDp, spaces: 4 })

      achievementsView += helper.codePrepare(`
        val achievement_${achievement.id} = ImageView(this)
        achievement_${achievement.id}.setImageResource(R.raw.${achievement.image})

        val layoutParamsAchievement_${achievement.id} = LayoutParams(
          ${sdp100Achievements.variable},
          ${sdp70Achievements.variable}
        )

        ${customLeftSdpAchievement.definition}${customTopSdpAchievement.definition}layoutParamsAchievement_${achievement.id}.gravity = Gravity.TOP or Gravity.START
        layoutParamsAchievement_${achievement.id}.setMargins(${customLeftSdpAchievement.variable}, ${customTopSdpAchievement.variable}, 0, 0)
        
        achievement_${achievement.id}.layoutParams = layoutParamsAchievement_${achievement.id}

        val ColorFilter_${achievement.id} = ColorMatrixColorFilter(ColorMatrixAchievements)
        achievement_first_achievement.setColorFilter(ColorFilter_${achievement.id})
        achievement_first_achievement.setAlpha(0.7f)

        frameLayoutScenes.addView(achievement_${achievement.id})`, 4
      )

      if (index != 0 && (index + 1).mod(4) == 0) {
        leftDp = 100
        topDp += 100
      } else {
        leftDp += 133
      }
    })
  }

  let achievementsCode = helper.codePrepare(`
    val scrollView = ScrollView(this)

    ${sdp300Achievements.definition}val layoutParamsScroll = LayoutParams(
      LayoutParams.MATCH_PARENT,
      ${sdp300Achievements.variable}
    )

    layoutParamsScroll.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL

    scrollView.layoutParams = layoutParamsScroll

    val frameLayoutScenes = FrameLayout(this)

    val inputStream = openFileInput("achievements.json")
    val text = inputStream.bufferedReader().use { it.readText() }
    inputStream.close()

    val achievements = JSONArray(text)${achievementsView}

    for (i in 0 until achievements.length()) {
${achievementsSwitch}
    }

    scrollView.addView(frameLayoutScenes)

    frameLayout.addView(scrollView)`)

  achievementsCode = helper.finalizeMultipleResources(menu, menu.pages.achievements, achievementsCode)

  helper.replace('__PERFORVNM_ACHIEVEMENTS_MENU__', achievementsCode)
}

export default {
  init,
  give,
  _AchievementGiveFunction,
  _SetAchievementsMenu
}