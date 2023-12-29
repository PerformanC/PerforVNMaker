/* TODO: Option for scenes to require an achievement and if not, fallback to another scene */

import helper from '../main/helper.js'
import { _GetMultiResources, _AddResource, _FinalizeMultiResources } from './helpers/optimizations.js'

function give(page, achievementId) {
  page.achievements.push({
    id: achievementId
  })

  return page
}

export function _AchievementGive() {
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

export function _SetAchievementsMenu() {
  const menu = AndroidVisualNovel.menu

  let achievementsSwitch = helper.codePrepare(`
    when (achievements.get${visualNovel.optimizations.hashAchievementIds ? 'Int' : 'String'}(i)) {
${visualNovel.achievements.map((achievement) => helper.codePrepare(`
      ${helper.getAchievementId(achievement.id)} -> {
        achievement_${achievement.id}.setColorFilter(null)
        achievement_${achievement.id}.setAlpha(1.0f)
      }`)).join('\n')}
    }`, 0, 2
  )

  const sdp300Achievements = _GetMultiResources(menu, menu.pages.achievements, { type: 'sdp', dp: '300' })
  menu.pages.achievements = _AddResource(menu.pages.achievements, { type: 'sdp', dp: '300', spaces: 4 })

  let achievementsView = ''
  if (visualNovel.achievements.length != 0) {
    const sdp100Achievements = _GetMultiResources(menu, menu.pages.achievements, { type: 'sdp', dp: '100' })
    menu.pages.achievements = _AddResource(menu.pages.achievements, { type: 'sdp', dp: '100', spaces: 4 })
  
    const sdp70Achievements = _GetMultiResources(menu, menu.pages.achievements, { type: 'sdp', dp: '70' })
    menu.pages.achievements = _AddResource(menu.pages.achievements, { type: 'sdp', dp: '70', spaces: 0 })

    achievementsView = helper.codePrepare(`\n
      ${sdp100Achievements.definition}${sdp70Achievements.definition}val ColorMatrixAchievements = ColorMatrix()
      ColorMatrixAchievements.setSaturation(0.0f)\n\n`, 2, 0, false
    )

    let leftDp = 120
    let topDp = 50
  
    visualNovel.achievements.forEach((achievement, index) => {
      let customLeftSdpAchievement = _GetMultiResources(menu, menu.pages.achievements, { type: 'sdp', dp: leftDp })
      menu.pages.achievements = _AddResource(menu.pages.achievements, { type: 'sdp', dp: leftDp, spaces: 4 })

      let customTopSdpAchievement = _GetMultiResources(menu, menu.pages.achievements, { type: 'sdp', dp: topDp })
      menu.pages.achievements = _AddResource(menu.pages.achievements, { type: 'sdp', dp: topDp, spaces: 4 })

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

    frameLayout.addView(scrollView)`
  )

  achievementsCode = _FinalizeMultiResources(menu, menu.pages.achievements, achievementsCode)

  return achievementsCode
}

export function _AchievementWrapperGive(achievements) {
  return helper.codePrepare(`
    ${achievements.map((achievement) => {
      if (visualNovel.optimizations.hashAchievementIds)
        return `giveAchievement(${helper.getAchievementId(achievement.id)})`
      else
        return `giveAchievement(${helper.getAchievementId(achievement.id)}, "${helper.getAchievementId(achievement.id, true)}")`
    }).join('\n')}\n\n`
  )
}

export default {
  give
}