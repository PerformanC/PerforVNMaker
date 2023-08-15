function init(options) {
  if (!options?.name)
    helper.logFatal('Scene name not provided.')

  if (['onCreate', 'onDestroy', 'onResume', 'onPause', 'menu', 'about', 'settings', 'saves'].includes(options.name))
    helper.logFatal('Scene name is already in usage by PerforVNM internals.')

  if (visualNovel.scenes.find(scene => scene.name == options.name))
    helper.logFatal('A scene already exists with this name.')

  return { name: options.name, type: 'subScene', next: null, characters: [], subScenes: [], background: null, speech: null, effect: null, music: null, transition: null }
}

export default {
  init
}