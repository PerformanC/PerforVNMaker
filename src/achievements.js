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
    private fun giveAchievement(achievement: String, achievementParsed: String) {
      val inputStream = openFileInput("achievements.json")
      var text = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      if (text == "[]") text = "[" + achievementParsed + "]"
      else {
        val achievementsJson = JSONArray(text)

        for (i in 0 until achievementsJson.length()) {
          if (achievementsJson.getString(i) == achievement) return
        }

        text = text.dropLast(1) + ", " + achievementParsed + "]"
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
    when (achievement) {
${visualNovel.achievements.map((achievement) => helper.codePrepare(`
      "${achievement.id}" -> achievementImage = R.raw.${achievement.image}`)).join('\n')}
    }`, 0, 2
  )

  const sdp300Achievements = helper.getMultipleResources(menu, menu.pages.achievements, { type: 'sdp', dp: '300' })
  menu.pages.achievements = helper.addResource(menu.pages.achievements, { type: 'sdp', dp: '300', spaces: 4 })

  const sdp100Achievements = helper.getMultipleResources(menu, menu.pages.achievementsFor, { type: 'sdp', dp: '100' })
  menu.pages.achievementsFor = helper.addResource(menu.pages.achievementsFor, { type: 'sdp', dp: '100', spaces: 6 })

  const sdp70Achievements = helper.getMultipleResources(menu, menu.pages.achievementsFor, { type: 'sdp', dp: '70' })
  menu.pages.achievementsFor = helper.addResource(menu.pages.achievementsFor, { type: 'sdp', dp: '70', spaces: 6 })

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

    val achievements = JSONArray(text)

    var leftDp = 120
    var topDp = 50

    for (i in 0 until achievements.length()) {
      val achievement = achievements.getString(i)

      ${sdp100Achievements.definition}${sdp70Achievements.definition}val layoutParamsSavesBackground = LayoutParams(
        ${sdp100Achievements.variable},
        ${sdp70Achievements.variable}
      )

      val leftDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_\${leftDp}sdp", "dimen", getPackageName()))
      val topDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_\${topDp}sdp", "dimen", getPackageName()))

      layoutParamsSavesBackground.gravity = Gravity.TOP or Gravity.START
      layoutParamsSavesBackground.setMargins(leftDpLoad, topDpLoad, 0, 0)

      var achievementImage: Int = 0

${achievementsSwitch}

      val imageViewAchievement = ImageView(this)
      imageViewAchievement.setImageResource(achievementImage)

      val layoutParamsAchievement = LayoutParams(
        ${sdp70Achievements.variable},
        ${sdp70Achievements.variable}
      )

      layoutParamsAchievement.gravity = Gravity.TOP or Gravity.START
      layoutParamsAchievement.setMargins(leftDpLoad, topDpLoad, 0, 0)

      imageViewAchievement.layoutParams = layoutParamsAchievement

      frameLayoutScenes.addView(imageViewAchievement)

      if (i != 0 && (i + 1).mod(4) == 0) {
        leftDp = 100
        topDp += 100
      } else {
        leftDp += 133
      }
    }

    scrollView.addView(frameLayoutScenes)

    frameLayout.addView(scrollView)`)

  achievementsCode = helper.finalizeMultipleResources(menu, menu.pages.achievements, achievementsCode)
  achievementsCode = helper.finalizeResources(menu.pages.achievementsFor, achievementsCode)

  helper.replace('__PERFORVNM_ACHIEVEMENTS_MENU__', achievementsCode)
}

export default {
  init,
  give,
  _AchievementGiveFunction,
  _SetAchievementsMenu
}