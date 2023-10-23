/* TODO: Sub-scene searchs from O(n) to O(1) through objects */

function init(options) {
  return {
    name: options.name,
    type: 'subScene',
    options: {
      textColor: options.textColor,
      backTextColor: options.backTextColor,
      buttonsColor: options.buttonsColor,
      footerTextColor: options.footerTextColor
    },
    next: null,
    characters: [],
    subScenes: [],
    background: null,
    speech: null,
    effect: null,
    music: null,
    transition: null,
    achievements: [],
    items: {
      give: [],
      require: []
    },
    custom: [],
    resources: {}
  }
}

export default {
  init
}