import helper from './helper.js'

function init(options) {
  const checks = {
    'textColor': {
      type: 'string'
    },
    'backTextColor': {
      type: 'string'
    },
    'textSpeed': {
      type: 'number'
    },
    'aboutText': {
      type: 'string'
    },
    'seekBar': {
      type: 'object',
      params: {
        'backgroundColor': {
          type: 'string'
        },
        'progressColor': {
          type: 'string'
        },
        'thumbColor': {
          type: 'string'
        }
      }
    },
    'background': {
      type: 'object',
      params: {
        'image': {
          type: 'string'
        },
        'music': {
          type: 'string',
          required: false
        }
      }
    },
    'footer': {
      type: 'object',
      params: {
        'color': {
          type: 'string'
        },
        'textColor': {
          type: 'string'
        },
        'opacity': {
          type: 'number',
          min: 0,
          max: 1
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  return {
    ...options,
    custom: [],
    pages: {
      main: {
        resources: []
      },
      about: {
        resources: []
      },
      settings: {
        resources: []
      },
      savesFor: {
        resources: []
      },
      saves: {
        resources: []
      }
    },
    resources: []
  }
}


function addCustomText(menu, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'color': {
      type: 'string'
    },
    'fontSize': {
      type: 'number'
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }
  
  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'text',
    ...options
  })

  return menu
}

function addCustomButton(menu, options) {
  const checks = {
    'text': {
      type: 'string'
    },
    'color': {
      type: 'string'
    },
    'fontSize': {
      type: 'number'
    },
    'height': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: 'number',
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'button',
    ...options
  })

  return menu
}

function addCustomRectangle(menu, options) {
  const checks = {
    'color': {
      type: 'string'
    },
    'opacity': {
      type: 'number',
      min: 0,
      max: 1
    },
    'height': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'rectangle',
    ...options
  })

  return menu
}

function addCustomImage(menu, options) {
  const checks = {
    'image': {
      type: 'fileInitial',
      basePath: `${visualNovel.info.paths.android}/app/src/main/res/raw/`
    },
    'height': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'width': {
      type: [ 'number', 'string' ],
      shouldCheckValues: (value) => {
        return typeof value != 'number'
      },
      values: [ 'match', 'wrap' ]
    },
    'position': {
      type: 'object',
      params: {
        'side': {
          type: 'string',
          values: [ 'center', 'left', 'right' ]
        },
        'margins': {
          type: 'object',
          params: {
            'side': {
              type: 'number'
            },
            'top': {
              type: 'number'
            }
          }
        }
      }
    }
  }

  helper.verifyParams(checks, options)

  menu.custom.push({
    type: 'image',
    ...options
  })

  return menu
}

function finalize(menu) {
  let customCode = ''
  menu.custom.forEach((custom, index) => {
    switch (custom.type) {
      case 'text': {
        const customTextSsp = helper.getResource(menu, { type: 'ssp', dp: custom.fontSize })
        menu = helper.addResource(menu, { type: 'ssp', dp: custom.fontSize })

        customCode += helper.codePrepare(`
          ${customTextSsp.definition ? `${customTextSsp.definition}\n          ` : ''}val textViewCustomText${index} = TextView(this)
          textViewCustomText${index}.text = "${custom.text}"
          textViewCustomText${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${customTextSsp.variable})
          textViewCustomText${index}.setTextColor(0xFF${custom.color}.toInt())

          val layoutParamsCustomText${index} = LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
          )\n\n`, 6
        )

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.top })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.top })

              if (marginTopSdp.definition) definitions.push(
                helper.codePrepare(marginTopSdp.definition + marginTopSdp.additionalSpace, 0, 4, false)
              )
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.side })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.side })

              if (marginSideSdp.definition) definitions.push(
                helper.codePrepare(marginSideSdp.definition + marginSideSdp.additionalSpace, 0, 4, false)
              )
            }

            customCode +=
              definitions.join('\n') +

              helper.codePrepare(`
                layoutParamsCustomText${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomText${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

                textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

                frameLayout.addView(textViewCustomText${index})\n\n`, 12
              )

            break
          }
          case 'center': {
            customCode += helper.codePrepare(`
              layoutParamsCustomText${index}.gravity = Gravity.CENTER

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 12
            )

            break
          }
        }

        break
      }
      case 'button': {
        const customTextSsp = helper.getResource(menu, { type: 'ssp', dp: custom.fontSize })
        menu = helper.addResource(menu, { type: 'ssp', dp: custom.fontSize })

        customCode += helper.codePrepare(`
          ${customTextSsp.definition ? `${customTextSsp.definition}\n          ` : ''}val buttonCustomButton${index} = Button(this)
          buttonCustomButton${index}.text = "${custom.text}"
          buttonCustomButton${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${customTextSsp.variable})
          buttonCustomButton${index}.setTextColor(0xFF${custom.color}.toInt())
          buttonCustomButton${index}.background = null__PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomButton${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            customCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            customCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = helper.getResource(menu, { type: 'sdp', dp: custom.height })
            menu = helper.addResource(menu, { type: 'sdp', dp: custom.height })

            if (customHeight.definition) customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__`)

            customCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            customCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            customCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = helper.getResource(menu, { type: 'sdp', dp: custom.width })
            menu = helper.addResource(menu, { type: 'sdp', dp: custom.width })

            if (customWidth.definition) customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            customCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', '')
        customCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.top })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.top })

              if (marginTopSdp.definition) definitions.push(
                helper.codePrepare(marginTopSdp.definition, 0, 4, false)
              )
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.side })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.side })

              if (marginSideSdp.definition) definitions.push(
                helper.codePrepare(marginSideSdp.definition, 0, 4, false)
              )
            }

            customCode +=
              definitions.join('\n') +

              helper.codePrepare(`
                layoutParamsCustomButton${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomButton${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

                buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

                frameLayout.addView(buttonCustomButton${index})\n\n`, 12
              )

            break
          }
          case 'center': {
            customCode += helper.codePrepare(`
              layoutParamsCustomButton${index}.gravity = Gravity.CENTER

              buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

              frameLayout.addView(buttonCustomButton${index})\n\n`, 10
            )

            break
          }
        }

        break
      }
      case 'rectangle': {
        customCode += helper.codePrepare(`
          val rectangleViewCustomRectangle${index} = RectangleView(this)__PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomRectangle${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            customCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            customCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = helper.getResource(menu, { type: 'sdp', dp: custom.height })
            menu = helper.addResource(menu, { type: 'sdp', dp: custom.height })

            if (customHeight.definition) customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__${customHeight.additionalSpace}`)

            customCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            customCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            customCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = helper.getResource(menu, { type: 'sdp', dp: custom.width })
            menu = helper.addResource(menu, { type: 'sdp', dp: custom.width })

            if (customWidth.definition) customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}${customWidth.additionalSpace}`)

            customCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', '')
        customCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.top })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.top })

              if (marginTopSdp.definition) definitions.push(
                helper.codePrepare(marginTopSdp.definition + marginTopSdp.additionalSpace, 0, 4, false)
              )
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.side })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.side })

              if (marginSideSdp.definition) definitions.push(
                helper.codePrepare(marginSideSdp.definition + marginSideSdp.additionalSpace, 0, 4, false)
              )
            }

            customCode +=
              definitions.join('\n') +

              helper.codePrepare(`
                layoutParamsCustomRectangle${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomRectangle${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

                rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

                frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 12
              )

            break
          }
          case 'center': {
            customCode += helper.codePrepare(`
              layoutParamsCustomRectangle${index}.gravity = Gravity.CENTER

              rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

              frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 10
            )

            break
          }
        }

        break
      }
      case 'image': {
        customCode += helper.codePrepare(`
          val imageViewCustomImage${index} = ImageView(this)
          imageViewCustomImage${index}.setImageResource(R.drawable.${custom.image})

          __PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomImage${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            customCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            customCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = helper.getResource(menu, { type: 'sdp', dp: custom.height })
            menu = helper.addResource(menu, { type: 'sdp', dp: custom.height })

            if (customHeight.definition) customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__`)

            customCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            customCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            customCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = helper.getResource(menu, { type: 'sdp', dp: custom.width })
            menu = helper.addResource(menu, { type: 'sdp', dp: custom.width })

            if (customWidth.definition) customCode = customCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            customCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        customCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.top })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.top })

              if (marginTopSdp.definition) definitions.push(
                helper.codePrepare(marginSideSdp.definition, 0, 4, false)
              )
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = helper.getResource(menu, { type: 'sdp', dp: custom.position.margins.side })
              menu = helper.addResource(menu, { type: 'sdp', dp: custom.position.margins.side })

              if (marginSideSdp.definition) definitions.push(
                helper.codePrepare(marginSideSdp.definition, 0, 4, false)
              )
            }

            customCode +=
              definitions.join('\n') +

              helper.codePrepare(`
                layoutParamsCustomImage${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomImage${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

                imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

                frameLayout.addView(imageViewCustomImage${index})\n\n`, 12
              )

            break
          }
          case 'center': {
            customCode += helper.codePrepare(`
              layoutParamsCustomImage${index}.gravity = Gravity.CENTER

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})`, 10
            )

            break
          }
        }

        break
      }
    }
  })

  let mainCode = 'val sharedPreferences = getSharedPreferences("VNConfig", Context.MODE_PRIVATE)\n'

  if (menu.background.music) {
    mainCode += helper.codePrepare(`
      mediaPlayer = MediaPlayer.create(this, R.raw.${menu.background.music})

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = sharedPreferences.getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }\n\n`, 2
    )
  }

  mainCode += helper.codePrepare(`
    textSpeed = sharedPreferences.getLong("textSpeed", ${menu.textSpeed}L)

    sEffectVolume = sharedPreferences.getFloat("sEffectVolume", 1f)

    val savesFile = File(getFilesDir(), "saves.json")
    if (!savesFile.exists()) {
      savesFile.createNewFile()
      savesFile.writeText("[]")
    }

    menu()`
  )

  helper.replace(/__PERFORVNM_MENU__/g, mainCode)

  const sdp30Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'sdp', dp: '30' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'sdp', dp: '30' })

  const ssp13Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'ssp', dp: '13' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'ssp', dp: '13' })

  const sdp88Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'sdp', dp: '88' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'sdp', dp: '88' })

  const sdpMinus3Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'sdp', dp: 'minus3' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'sdp', dp: 'minus3' })

  const sdp161Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'sdp', dp: '161' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'sdp', dp: '161' })

  const sdp233Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'sdp', dp: '233' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'sdp', dp: '233' })

  const sdp320Main = helper.getMultipleResources(menu, menu.pages.main, { type: 'sdp', dp: '320' })
  menu.pages.main = helper.addResource(menu.pages.main, { type: 'sdp', dp: '320' })

  let menuCode = helper.codePrepare(`
    private fun menu() {
      val frameLayout = FrameLayout(this)
      frameLayout.setBackgroundColor(0xFF000000.toInt())

      val imageView = ImageView(this)
      imageView.setImageResource(R.raw.${menu.background.image})
      imageView.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView)

      val rectangleView = RectangleView(this)

      ${sdp30Main.definition ? `${sdp30Main.definition}\n      ` : ''}val layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, ${sdp30Main.variable})
      layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParams
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      ${ssp13Main.definition ? `${ssp13Main.definition}\n      ` : ''}val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Main.variable})
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp88Main.definition ? `${sdp88Main.definition}\n      ` : ''}${sdpMinus3Main.definition ? `${sdpMinus3Main.definition}\n      ` : ''}layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(${sdp88Main.variable}, 0, 0, ${sdpMinus3Main.variable})

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Main.variable})
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp161Main.definition ? `${sdp161Main.definition}\n      ` : ''}layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(${sdp161Main.variable}, 0, 0, ${sdpMinus3Main.variable})

      buttonAbout.layoutParams = layoutParamsAbout

      buttonAbout.setOnClickListener {
        about(true)
      }

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Main.variable})
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp233Main.definition ? `${sdp233Main.definition}\n      ` : ''}layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(${sdp233Main.variable}, 0, 0, ${sdpMinus3Main.variable})

      buttonSettings.layoutParams = layoutParamsSettings

      buttonSettings.setOnClickListener {
        settings(true)
      }

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Main.variable})
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp320Main.definition ? `${sdp320Main.definition}\n      ` : ''}layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(${sdp320Main.variable}, 0, 0, ${sdpMinus3Main.variable})

      buttonSaves.layoutParams = layoutParamsSaves

      buttonSaves.setOnClickListener {
        saves(true)
      }

      frameLayout.addView(buttonSaves)\n\n`, 2
  )

  if (menu.custom.length != 0) {
    menuCode += customCode
  }

  menuCode += helper.codePrepare(`
      setContentView(frameLayout)
    }`, 2
  )

  helper.writeFunction(menuCode)

  const rectangleViewCode = helper.codePrepare(`
    class RectangleView(context: Context) : View(context) {
      private val paint = Paint().apply {
        color = 0xFF${menu.footer.color}.toInt()
        style = Paint.Style.FILL
      }

      fun setColor(color: Int) {
        paint.color = color
      }

      override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        val rect = canvas?.clipBounds ?: return
        canvas.drawRect(rect, paint)
      }
    }\n`, 4, 0, false
  )

  helper.replace('__PERFORVNM_CLASSES__', rectangleViewCode)

  const sdp30About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '30' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '30' })

  const ssp13About = helper.getMultipleResources(menu, menu.pages.about, { type: 'ssp', dp: '13' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'ssp', dp: '13' })

  const sdpMinus3About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: 'minus3' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: 'minus3' })

  const sdp88About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '88' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '88' })

  const sdp53About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '53' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '53' })

  const sdp161About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '161' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '161' })

  const sdp233About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '233' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '233' })

  const sdp320About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '320' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '320' })

  const ssp15About = helper.getMultipleResources(menu, menu.pages.about, { type: 'ssp', dp: '15' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'ssp', dp: '15' })

  const sdp73About = helper.getMultipleResources(menu, menu.pages.about, { type: 'sdp', dp: '73' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'sdp', dp: '73' })

  const ssp11About = helper.getMultipleResources(menu, menu.pages.about, { type: 'ssp', dp: '11' })
  menu.pages.about = helper.addResource(menu.pages.about, { type: 'ssp', dp: '11' })

  let aboutCode = helper.codePrepare(`
    private fun about(animate: Boolean) {
      val frameLayout = FrameLayout(this)
      frameLayout.setBackgroundColor(0xFF000000.toInt())

      val imageView = ImageView(this)
      imageView.setImageResource(R.raw.${menu.background.image})
      imageView.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView)

      val rectangleGrayView = RectangleView(this)

      val layoutParamsGrayRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
      layoutParamsGrayRectangle.gravity = Gravity.CENTER

      rectangleGrayView.layoutParams = layoutParamsGrayRectangle
      rectangleGrayView.setColor(0xFF000000.toInt())

      frameLayout.addView(rectangleGrayView)

      if (animate) {
        val animationRectangleGray = AlphaAnimation(0f, 0.8f)
        animationRectangleGray.duration = 500
        animationRectangleGray.interpolator = LinearInterpolator()
        animationRectangleGray.fillAfter = true

        rectangleGrayView.startAnimation(animationRectangleGray)
      } else {
        rectangleGrayView.setAlpha(0.8f)
      }

      val rectangleView = RectangleView(this)

      ${sdp30About.definition ? `${sdp30About.definition}\n      ` : ''}val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, ${sdp30About.variable})
      layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParamsRectangle
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      ${ssp13About.definition ? `${ssp13About.definition}\n      ` : ''}val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13About.variable})
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp88About.definition ? `${sdp88About.definition}\n      ` : ''}${sdpMinus3About.definition ? `${sdpMinus3About.definition}\n      ` : ''}layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(${sdp88About.variable}, 0, 0, ${sdpMinus3About.variable})

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13About.variable})
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp161About.definition ? `${sdp161About.definition}\n      ` : ''}layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(${sdp161About.variable}, 0, 0, ${sdpMinus3About.variable})

      buttonAbout.layoutParams = layoutParamsAbout

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13About.variable})
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp233About.definition ? `${sdp233About.definition}\n      ` : ''}layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(${sdp233About.variable}, 0, 0, ${sdpMinus3About.variable})

      buttonSettings.layoutParams = layoutParamsSettings

      buttonSettings.setOnClickListener {
        settings(false)
      }

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13About.variable})
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp320About.definition ? `${sdp320About.definition}\n      ` : ''}layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(${sdp320About.variable}, 0, 0, ${sdpMinus3About.variable})

      buttonSaves.layoutParams = layoutParamsSaves

      buttonSaves.setOnClickListener {
        saves(false)
      }

      frameLayout.addView(buttonSaves)

      ${ssp15About.definition ? `${ssp15About.definition}\n      ` : ''}val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp15About.variable})
      buttonBack.setTextColor(0xFF${menu.backTextColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp73About.definition ? `${sdp73About.definition}\n      ` : ''}layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(${sdp73About.variable}, 0, 0, 0)

      buttonBack.layoutParams = layoutParamsBack

      val animationTexts = AlphaAnimation(0f, 1f)
      animationTexts.duration = 500
      animationTexts.interpolator = LinearInterpolator()
      animationTexts.fillAfter = true

      buttonBack.startAnimation(animationTexts)

      buttonBack.setOnClickListener {
        menu()
      }

      frameLayout.addView(buttonBack)

      ${ssp11About.definition ? `${ssp11About.definition}\n      ` : ''}val textView = TextView(this)
      textView.text = SpannableStringBuilder().apply {
        append("${visualNovel.info.fullName} ${visualNovel.info.version}\\n\\nMade with ")
        append("PerforVNM")
        setSpan(object : ClickableSpan() {
          override fun onClick(widget: View) {
            startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("${PerforVNM.repository}")))
          }
        }, length - "PerforVNM".length, length, 0)
        append(" ${PerforVNM.codeGeneratorVersion} (code generator), ${PerforVNM.generatedCodeVersion} (generated code).`, 2
  )

  if (menu.aboutText) {
    aboutCode += `\\n\\n${JSON.stringify(menu.aboutText).slice(1, -1)}")\n`
  } else {
    aboutCode += '")\n'
  }

  aboutCode += helper.codePrepare(`
    }
    textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp11About.variable})
    textView.setTextColor(0xFF${menu.textColor}.toInt())

    val layoutParamsText = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    ${sdp53About.definition ? `${sdp53About.definition}\n    ` : ''}layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(${sdp88About.variable}, ${sdp53About.variable}, 0, 0)

    textView.layoutParams = layoutParamsText
    textView.startAnimation(animationTexts)

    textView.ellipsize = TextUtils.TruncateAt.END
    textView.movementMethod = LinkMovementMethod.getInstance()

    frameLayout.addView(textView)\n\n`
  )

  if (menu.custom.length != 0) {
    aboutCode += customCode
  }

  aboutCode += helper.codePrepare(`
      setContentView(frameLayout)
    }`, 2
  )

  helper.writeFunction(aboutCode)


  const sdp30Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '30' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '30' })

  const ssp13Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'ssp', dp: '13' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'ssp', dp: '13' })

  const sdp88Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '88' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '88' })

  const sdpMinus3Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: 'minus3' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: 'minus3' })

  const sdp161Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '161' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '161' })

  const sdp233Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '233' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '233' })

  const sdp320Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '320' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '320' })

  const ssp15Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'ssp', dp: '15' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'ssp', dp: '15' })

  const sdp73Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '73' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '73' })

  const ssp16Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'ssp', dp: '16' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'ssp', dp: '16' })

  const sdp149Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '149' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '149' })

  const sdp53Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '53' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '53' })

  const sdp150Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '150' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '150' })

  const sdp135Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '135' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '135' })

  const sdp77Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '77' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '77' })

  const sdp443Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '443' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '443' })

  const sdp432Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '432' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '432' })

  const sdp111Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '111' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '111' })

  const sdp166Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '166' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '166' })

  const sdp190Settings = helper.getMultipleResources(menu, menu.pages.settings, { type: 'sdp', dp: '190' })
  menu.pages.settings = helper.addResource(menu.pages.settings, { type: 'sdp', dp: '190' })

  let settingsCode = helper.codePrepare(`
    private fun settings(animate: Boolean) {
      val frameLayout = FrameLayout(this)
      frameLayout.setBackgroundColor(0xFF000000.toInt())

      val imageView = ImageView(this)
      imageView.setImageResource(R.raw.${menu.background.image})
      imageView.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView)

      val rectangleGrayView = RectangleView(this)

      val layoutParamsGrayRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
      layoutParamsGrayRectangle.gravity = Gravity.CENTER

      rectangleGrayView.layoutParams = layoutParamsGrayRectangle
      rectangleGrayView.setColor(0xFF000000.toInt())

      frameLayout.addView(rectangleGrayView)

      if (animate) {
        val animationRectangleGray = AlphaAnimation(0f, 0.8f)
        animationRectangleGray.duration = 500
        animationRectangleGray.interpolator = LinearInterpolator()
        animationRectangleGray.fillAfter = true

        rectangleGrayView.startAnimation(animationRectangleGray)
      } else {
        rectangleGrayView.setAlpha(0.8f)
      }

      val rectangleView = RectangleView(this)

      ${sdp30Settings.definition ? `${sdp30Settings.definition}\n      ` : ''}val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, ${sdp30Settings.variable})
      layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParamsRectangle
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      ${ssp13Settings.definition ? `${ssp13Settings.definition}\n      ` : ''}val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Settings.variable})
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp88Settings.definition ? `${sdp88Settings.definition}\n      ` : ''}${sdpMinus3Settings.definition ? `${sdpMinus3Settings.definition}\n      ` : ''}layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(${sdp88Settings.variable}, 0, 0, ${sdpMinus3Settings.variable})

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Settings.variable})
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp161Settings.definition ? `${sdp161Settings.definition}\n      ` : ''}layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(${sdp161Settings.variable}, 0, 0, ${sdpMinus3Settings.variable})

      buttonAbout.layoutParams = layoutParamsAbout

      buttonAbout.setOnClickListener {
        about(false)
      }

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Settings.variable})
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp233Settings.definition ? `${sdp233Settings.definition}\n      ` : ''}layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(${sdp233Settings.variable}, 0, 0, ${sdpMinus3Settings.variable})

      buttonSettings.layoutParams = layoutParamsSettings

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Settings.variable})
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp320Settings.definition ? `${sdp320Settings.definition}\n      ` : ''}layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(${sdp320Settings.variable}, 0, 0, ${sdpMinus3Settings.variable})

      buttonSaves.layoutParams = layoutParamsSaves

      buttonSaves.setOnClickListener {
        saves(false)
      }

      frameLayout.addView(buttonSaves)

      ${ssp15Settings.definition ? `${ssp15Settings.definition}\n      ` : ''}val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp15Settings.variable})
      buttonBack.setTextColor(0xFF${menu.backTextColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp73Settings.definition ? `${sdp73Settings.definition}\n      ` : ''}layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(${sdp73Settings.variable}, 0, 0, 0)

      buttonBack.layoutParams = layoutParamsBack

      val animationTexts = AlphaAnimation(0f, 1f)
      animationTexts.duration = 500
      animationTexts.interpolator = LinearInterpolator()
      animationTexts.fillAfter = true

      buttonBack.startAnimation(animationTexts)

      buttonBack.setOnClickListener {
        menu()
      }

      frameLayout.addView(buttonBack)

      ${ssp16Settings.definition ? `${ssp16Settings.definition}\n      ` : ''}val textViewTextSpeed = TextView(this)
      textViewTextSpeed.text = "Text speed: " + textSpeed.toString() + "ms"
      textViewTextSpeed.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp16Settings.variable})
      textViewTextSpeed.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsText = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp149Settings.definition ? `${sdp149Settings.definition}\n      ` : ''}${sdp53Settings.definition ? `${sdp53Settings.definition}\n      ` : ''}layoutParamsText.gravity = Gravity.TOP or Gravity.START
      layoutParamsText.setMargins(${sdp149Settings.variable}, ${sdp53Settings.variable}, 0, 0)

      textViewTextSpeed.layoutParams = layoutParamsText
      textViewTextSpeed.startAnimation(animationTexts)

      frameLayout.addView(textViewTextSpeed)

      val seekBarTextSpeed = SeekBar(this)
      seekBarTextSpeed.max = 100
      seekBarTextSpeed.progress = textSpeed.toInt()

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)
        seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)
      } else {
        @Suppress("DEPRECATION")
        seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)

        @Suppress("DEPRECATION")
        seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)
      }

      seekBarTextSpeed.thumbOffset = 0

      ${sdp150Settings.definition ? `${sdp150Settings.definition}\n      ` : ''}val layoutParamsSeekBar = LayoutParams(
        ${sdp150Settings.variable},
        LayoutParams.WRAP_CONTENT
      )

      ${sdp135Settings.definition ? `${sdp135Settings.definition}\n      ` : ''}${sdp77Settings.definition ? `${sdp77Settings.definition}\n      ` : ''}layoutParamsSeekBar.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBar.setMargins(${sdp135Settings.variable}, ${sdp77Settings.variable}, 0, 0)

      seekBarTextSpeed.layoutParams = layoutParamsSeekBar
      seekBarTextSpeed.startAnimation(animationTexts)

      frameLayout.addView(seekBarTextSpeed)

      val sharedPreferences = getSharedPreferences("VNConfig", Context.MODE_PRIVATE)
      val editor = sharedPreferences.edit()

      seekBarTextSpeed.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
        override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
          if (fromUser) {
            textViewTextSpeed.text = "Text speed: " + progress.toString() + "ms"
            textSpeed = progress.toLong()

            editor.putLong("textSpeed", progress.toLong())
            editor.apply()
          }
        }

        override fun onStartTrackingTouch(seekBar: SeekBar?) {}

        override fun onStopTrackingTouch(seekBar: SeekBar?) {}
      })

      val musicVolume = sharedPreferences.getFloat("musicVolume", 1f)

      val textViewMusicVolume = TextView(this)
      textViewMusicVolume.text = "Menu music: " + (musicVolume * 100).toInt().toString() + "%"
      textViewMusicVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp16Settings.variable})
      textViewMusicVolume.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsTextMusicVolume = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp443Settings.definition ? `${sdp443Settings.definition}\n      ` : ''}layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsTextMusicVolume.setMargins(${sdp443Settings.variable}, ${sdp53Settings.variable}, 0, 0)

      textViewMusicVolume.layoutParams = layoutParamsTextMusicVolume
      textViewMusicVolume.startAnimation(animationTexts)

      frameLayout.addView(textViewMusicVolume)

      val seekBarMusicVolume = SeekBar(this)
      seekBarMusicVolume.max = 100
      seekBarMusicVolume.progress = (musicVolume * 100).toInt()

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)
        seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)
      } else {
        @Suppress("DEPRECATION")
        seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)

        @Suppress("DEPRECATION")
        seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)
      }

      seekBarMusicVolume.thumbOffset = 0

      val layoutParamsSeekBarMusicVolume = LayoutParams(
        ${sdp150Settings.variable},
        LayoutParams.WRAP_CONTENT
      )

      ${sdp432Settings.definition ? `${sdp432Settings.definition}\n      ` : ''}layoutParamsSeekBarMusicVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBarMusicVolume.setMargins(${sdp432Settings.variable}, ${sdp77Settings.variable}, 0, 0)

      seekBarMusicVolume.layoutParams = layoutParamsSeekBarMusicVolume
      seekBarMusicVolume.startAnimation(animationTexts)

      frameLayout.addView(seekBarMusicVolume)

      seekBarMusicVolume.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
        override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
          if (fromUser) {
            textViewMusicVolume.text = "Menu music: " + progress.toString() + "%"

            editor.putFloat("musicVolume", progress.toFloat() / 100)
            editor.apply()

            mediaPlayer?.setVolume(progress.toFloat() / 100, progress.toFloat() / 100)
          }
        }

        override fun onStartTrackingTouch(seekBar: SeekBar?) {}

        override fun onStopTrackingTouch(seekBar: SeekBar?) {}
      })

      val textViewSEffectVolume = TextView(this)
      textViewSEffectVolume.text = "Sound effects: " + (sEffectVolume * 100).toInt().toString() + "%"
      textViewSEffectVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp16Settings.variable})
      textViewSEffectVolume.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsTextSEffectVolume = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp111Settings.definition ? `${sdp111Settings.definition}\n      ` : ''}layoutParamsTextSEffectVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsTextSEffectVolume.setMargins(${sdp443Settings.variable}, ${sdp111Settings.variable}, 0, 0)

      textViewSEffectVolume.layoutParams = layoutParamsTextSEffectVolume
      textViewSEffectVolume.startAnimation(animationTexts)

      frameLayout.addView(textViewSEffectVolume)

      val seekBarSEffectVolume = SeekBar(this)
      seekBarSEffectVolume.max = 100
      seekBarSEffectVolume.progress = (sEffectVolume * 100).toInt()

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        seekBarSEffectVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)
        seekBarSEffectVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)
      } else {
        @Suppress("DEPRECATION")
        seekBarSEffectVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)

        @Suppress("DEPRECATION")
        seekBarSEffectVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)
      }

      seekBarSEffectVolume.thumbOffset = 0

      val layoutParamsSeekBarSEffectVolume = LayoutParams(
        ${sdp150Settings.variable},
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSeekBarSEffectVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBarSEffectVolume.setMargins(${sdp432Settings.variable}, ${sdp135Settings.variable}, 0, 0)

      seekBarSEffectVolume.layoutParams = layoutParamsSeekBarSEffectVolume
      seekBarSEffectVolume.startAnimation(animationTexts)

      frameLayout.addView(seekBarSEffectVolume)

      seekBarSEffectVolume.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
        override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
          if (fromUser) {
            textViewSEffectVolume.text = "Sound effects: " + progress.toString() + "%"

            sEffectVolume = progress.toFloat() / 100

            editor.putFloat("sEffectVolume", sEffectVolume)
            editor.apply()
          }
        }

        override fun onStartTrackingTouch(seekBar: SeekBar?) {}

        override fun onStopTrackingTouch(seekBar: SeekBar?) {}
      })

      val textViewSceneMusic = TextView(this)
      textViewSceneMusic.text = "Scene music: " + (sceneMusicVolume * 100).toInt().toString() + "%"
      textViewSceneMusic.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp16Settings.variable})
      textViewSceneMusic.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsTextSceneMusic = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp166Settings.definition ? `${sdp166Settings.definition}\n      ` : ''}layoutParamsTextSceneMusic.gravity = Gravity.TOP or Gravity.START
      layoutParamsTextSceneMusic.setMargins(${sdp443Settings.variable}, ${sdp166Settings.variable}, 0, 0)

      textViewSceneMusic.layoutParams = layoutParamsTextSceneMusic
      textViewSceneMusic.startAnimation(animationTexts)

      frameLayout.addView(textViewSceneMusic)

      val seekBarSceneMusic = SeekBar(this)
      seekBarSceneMusic.max = 100
      seekBarSceneMusic.progress = (sceneMusicVolume * 100).toInt()

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        seekBarSceneMusic.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)
        seekBarSceneMusic.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)
      } else {
        @Suppress("DEPRECATION")
        seekBarSceneMusic.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)

        @Suppress("DEPRECATION")
        seekBarSceneMusic.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)
      }

      seekBarSceneMusic.thumbOffset = 0

      val layoutParamsSeekBarSceneMusic = LayoutParams(
        ${sdp150Settings.variable},
        LayoutParams.WRAP_CONTENT
      )

      ${sdp190Settings.definition ? `${sdp190Settings.definition}\n      ` : ''}layoutParamsSeekBarSceneMusic.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBarSceneMusic.setMargins(${sdp432Settings.variable}, ${sdp190Settings.variable}, 0, 0)

      seekBarSceneMusic.layoutParams = layoutParamsSeekBarSceneMusic
      seekBarSceneMusic.startAnimation(animationTexts)

      frameLayout.addView(seekBarSceneMusic)

      seekBarSceneMusic.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
        override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
          if (fromUser) {
            textViewSceneMusic.text = "Scene music: " + progress.toString() + "%"

            sceneMusicVolume = progress.toFloat() / 100

            editor.putFloat("sceneMusicVolume", sceneMusicVolume)
            editor.apply()
          }
        }

        override fun onStartTrackingTouch(seekBar: SeekBar?) {}

        override fun onStopTrackingTouch(seekBar: SeekBar?) {}
      })\n\n`, 2
  )

  if (menu.custom.length != 0) {
    settingsCode += customCode
  }

  settingsCode += helper.codePrepare(`
      setContentView(frameLayout)
    }`, 2
  )

  helper.writeFunction(settingsCode)

  visualNovel.customXML.push({
    path: 'drawable/custom_seekbar_progress.xml',
    content: helper.codePrepare(`
      <layer-list xmlns:android="http://schemas.android.com/apk/res/android">
        <item android:id="@android:id/background">
          <shape android:shape="rectangle">
            <solid android:color="#${menu.seekBar.backgroundColor}" />
            <size android:height="@dimen/_13sdp" />
          </shape>
        </item>
        <item android:id="@android:id/progress">
          <clip>
            <shape android:shape="rectangle">
              <solid android:color="#${menu.seekBar.progressColor}" />
              <size android:height="@dimen/_13sdp" />
            </shape>
          </clip>
        </item>
      </layer-list>`, 6
    )
  })

  visualNovel.customXML.push({
    path: 'drawable/custom_seekbar_thumb.xml',
    content: helper.codePrepare(`
      <shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
        <solid android:color="#${menu.seekBar.thumbColor}" />
        <size android:width="@dimen/_7sdp" android:height="@dimen/_13sdp" />
      </shape>`, 6
    )
  })

  const sdp30Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: '30' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: '30' })

  const ssp13Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'ssp', dp: '13' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'ssp', dp: '13' })

  const sdpMinus3Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: 'minus3' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: 'minus3' })

  const sdp88Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: '88' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: '88' })

  const sdp161Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: '161' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: '161' })

  const sdp233Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: '233' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: '233' })

  const sdp320Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: '320' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: '320' })

  const ssp15Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'ssp', dp: '15' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'ssp', dp: '15' })

  const sdp73Saves = helper.getMultipleResources(menu, menu.pages.saves, { type: 'sdp', dp: '73' })
  menu.pages.saves = helper.addResource(menu.pages.saves, { type: 'sdp', dp: '73' })

  const sdp100Saves = helper.getMultipleResources(menu, menu.pages.savesFor, { type: 'sdp', dp: '100' })
  menu.pages.saves = helper.addResource(menu.pages.savesFor, { type: 'sdp', dp: '100' })

  const sdp70Saves = helper.getMultipleResources(menu, menu.pages.savesFor, { type: 'sdp', dp: '70' })
  menu.pages.saves = helper.addResource(menu.pages.savesFor, { type: 'sdp', dp: '70' })

  let saverCode = helper.codePrepare(`
    private fun saves(animate: Boolean) {
      val frameLayout = FrameLayout(this)
      frameLayout.setBackgroundColor(0xFF000000.toInt())

      val imageView = ImageView(this)
      imageView.setImageResource(R.raw.${menu.background.image})
      imageView.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView)

      val rectangleGrayView = RectangleView(this)

      val layoutParamsGrayRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)
      layoutParamsGrayRectangle.gravity = Gravity.CENTER

      rectangleGrayView.layoutParams = layoutParamsGrayRectangle
      rectangleGrayView.setColor(0xFF000000.toInt())

      frameLayout.addView(rectangleGrayView)

      if (animate) {
        val animationRectangleGray = AlphaAnimation(0f, 0.8f)
        animationRectangleGray.duration = 500
        animationRectangleGray.interpolator = LinearInterpolator()
        animationRectangleGray.fillAfter = true

        rectangleGrayView.startAnimation(animationRectangleGray)
      } else {
        rectangleGrayView.setAlpha(0.8f)
      }

      val rectangleView = RectangleView(this)

      ${sdp30Saves.definition ? `${sdp30Saves.definition}\n      ` : ''}val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, ${sdp30Saves.variable})
      layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParamsRectangle
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      ${ssp13Saves.definition ? `${ssp13Saves.definition}\n      ` : ''}val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Saves.variable})
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp88Saves.definition ? `${sdp88Saves.definition}\n      ` : ''}${sdpMinus3Saves.definition ? `${sdpMinus3Saves.definition}\n      ` : ''}layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(${sdp88Saves.variable}, 0, 0, ${sdpMinus3Saves.variable})

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Saves.variable})
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp161Saves.definition ? `${sdp161Saves.definition}\n      ` : ''}layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(${sdp161Saves.variable}, 0, 0, ${sdpMinus3Saves.variable})

      buttonAbout.layoutParams = layoutParamsAbout

      buttonAbout.setOnClickListener {
        about(false)
      }

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Saves.variable})
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp233Saves.definition ? `${sdp233Saves.definition}\n      ` : ''}layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(${sdp233Saves.variable}, 0, 0, ${sdpMinus3Saves.variable})

      buttonSettings.layoutParams = layoutParamsSettings

      buttonSettings.setOnClickListener {
        settings(false)
      }

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp13Saves.variable})
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp320Saves.definition ? `${sdp320Saves.definition}\n      ` : ''}layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(${sdp320Saves.variable}, 0, 0, ${sdpMinus3Saves.variable})

      buttonSaves.layoutParams = layoutParamsSaves

      frameLayout.addView(buttonSaves)

      ${ssp15Saves.definition ? `${ssp15Saves.definition}\n      ` : ''}val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${ssp15Saves.variable})
      buttonBack.setTextColor(0xFF${menu.backTextColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      ${sdp73Saves.definition ? `${sdp73Saves.definition}\n      ` : ''}layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(${sdp73Saves.variable}, 0, 0, 0)

      buttonBack.layoutParams = layoutParamsBack

      val animationTexts = AlphaAnimation(0f, 1f)
      animationTexts.duration = 500
      animationTexts.interpolator = LinearInterpolator()
      animationTexts.fillAfter = true

      buttonBack.startAnimation(animationTexts)

      buttonBack.setOnClickListener {
        menu()
      }

      frameLayout.addView(buttonBack)

      val scrollView = ScrollView(this)

      scrollView.layoutParams = LayoutParams(
        LayoutParams.MATCH_PARENT,
        LayoutParams.MATCH_PARENT
      )

      val frameLayoutScenes = FrameLayout(this)

      val inputStream = openFileInput("saves.json")
      val text = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val saves = JSONArray(text)

      var leftDp = 100
      var topDp = 50

      for (i in 0 until saves.length()) {
        val buttonData = saves.getJSONObject(i)

        var savesBackground: View

        try {
          savesBackground = ImageView(this)
          savesBackground.setImageResource(resources.getIdentifier(buttonData.getString("scenario"), "raw", getPackageName()))
        } catch (e: Exception) {
          savesBackground = RectangleView(this)

          savesBackground.setColor(0xFF000000.toInt())
        }

        ${sdp100Saves.definition ? `${sdp100Saves.definition}\n        ` : ''}${sdp70Saves.definition ? `${sdp70Saves.definition}\n        ` : ''}val layoutParamsSavesBackground = LayoutParams(
          ${sdp100Saves.variable},
          ${sdp70Saves.variable}
        )

        val leftDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_\${leftDp}sdp", "dimen", getPackageName()))
        val topDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_\${topDp}sdp", "dimen", getPackageName()))

        layoutParamsSavesBackground.gravity = Gravity.TOP or Gravity.START
        layoutParamsSavesBackground.setMargins(leftDpLoad, topDpLoad, 0, 0)

        savesBackground.layoutParams = layoutParamsSavesBackground

        savesBackground.setOnClickListener {
  __PERFORVNM_RELEASE_MEDIA_PLAYER__

  __PERFORVNM_SWITCHES__
        }

        frameLayoutScenes.addView(savesBackground)

        val characters = buttonData.getJSONArray("characters")

        for (j in 0 until characters.length()) {
          val characterData = characters.getJSONObject(j)

          val imageViewCharacter = ImageView(this)
          imageViewCharacter.setImageResource(resources.getIdentifier(characterData.getString("image"), "raw", getPackageName()))

          val layoutParamsImageViewCharacter = LayoutParams(
            ${sdp100Saves.variable},
            ${sdp70Saves.variable}
          )

          layoutParamsImageViewCharacter.gravity = Gravity.TOP or Gravity.START

  __PERFORVNM_SAVES_SWITCH__

          imageViewCharacter.layoutParams = layoutParamsImageViewCharacter

          frameLayoutScenes.addView(imageViewCharacter)
        }

        if (i != 0 && (i + 1).mod(4) == 0) {
          leftDp = 100
          topDp += 100
        } else {
          leftDp += 133
        }
      }

      scrollView.addView(frameLayoutScenes)

      frameLayout.addView(scrollView)\n\n`, 2
  )

  if (menu.custom.length != 0) {
    saverCode += customCode
  }

  saverCode += helper.codePrepare(`
      setContentView(frameLayout)
    }`, 2
  )

  helper.writeFunction(saverCode)

  visualNovel.menu = {
    name: 'menu()',
    backgroundMusic: menu.background.music,
    options: menu
  }

  helper.logOk('Main, about, settings and saves menu coded.', 'Android')
}

export default {
  init,
  addCustomText,
  addCustomButton,
  addCustomRectangle,
  addCustomImage,
  finalize
}
