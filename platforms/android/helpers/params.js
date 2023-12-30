export function _GetSceneFParams(scene, oldScene, switchParam) {
  const params = { function: [], switch: [] }
  if (oldScene.speech || scene.subScenes.length != 0) {
    params.function.push('animate: Boolean')
    params.switch.push(switchParam || 'true')
  }
  if (scene.speech?.author?.name && oldScene.speech && !oldScene.speech?.author?.name) {
    params.function.push('animateAuthor: Boolean')
    params.switch.push(switchParam || 'true')
  }

  return params
}

export function _GetSceneParams(scene, oldScene, switchParam, sceneIndex) {
  const params = { function: [], switch: [] }

  if (scene?.speech || scene.transition) {
    params.function.push('animate: Boolean')
    params.switch.push(switchParam || 'true')
  }
  if (oldScene?.speech?.author?.name && scene.speech && !scene.speech?.author?.name && sceneIndex != visualNovel.scenes.length - 1) {
    params.function.push('animateAuthor: Boolean')
    params.switch.push(switchParam || 'true')
  }

  return params
}