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
    custom: []
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
        customCode += helper.codePrepare(`
          val textViewCustomText${index} = TextView(this)
          textViewCustomText${index}.text = "${custom.text}"
          textViewCustomText${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${custom.fontSize}ssp))
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
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomText${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomText${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            customCode += 
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomText${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomText${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomText${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomText${index}` : '0'}, 0)

                textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

                frameLayout.addView(textViewCustomText${index})\n\n`, 12
              )

            break
          }
          case 'center': {
            customCode += helper.codePrepare(`
              layoutParamsCustomText${index}.gravity = Gravity.CENTER

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 10
            )

            break
          }
        }

        break
      }
      case 'button': {
        customCode += helper.codePrepare(`
          val buttonCustomButton${index} = Button(this)
          buttonCustomButton${index}.text = "${custom.text}"
          buttonCustomButton${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._${custom.fontSize}ssp))
          buttonCustomButton${index}.setTextColor(0xFF${custom.color}.toInt())
          buttonCustomButton${index}.background = null

          val layoutParamsCustomButton${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            customCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            customCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            customCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),\n`
          }
        }

        switch (custom.width) {
          case 'match': {
            customCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            customCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            customCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),\n`
          }
        }

        customCode += '    )\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomButton${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomButton${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            customCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomButton${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomButton${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomButton${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomButton${index}` : '0'}, 0)

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
          val rectangleViewCustomRectangle${index} = RectangleView(this)

          val layoutParamsCustomRectangle${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            customCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            customCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            customCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),\n`
          }
        }

        switch (custom.width) {
          case 'match': {
            customCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            customCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            customCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),\n`
          }
        }

        customCode += '    )\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomRectangle${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomRectangle${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            customCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomRectangle${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomRectangle${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomRectangle${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomRectangle${index}` : '0'}, 0)

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

          val layoutParamsCustomImage${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            customCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            customCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            customCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.height}sdp),\n`
          }
        }

        switch (custom.width) {
          case 'match': {
            customCode += '      LayoutParams.MATCH_PARENT,\n'

            break
          }
          case 'wrap': {
            customCode += '      LayoutParams.WRAP_CONTENT,\n'

            break
          }
          default: {
            customCode += `      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.width}sdp),\n`
          }
        }

        customCode += '    )\n\n'

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            const definitions = []
            if (custom.position.margins.top != 0) {
              definitions.push(`    val topDpCustomImage${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.top}sdp)`)
            }

            if (custom.position.margins.side != 0) {
              definitions.push(`    val ${custom.position.side}DpCustomImage${index} = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._${custom.position.margins.side}sdp)`)
            }

            customCode +=
              definitions.join('\n') + '\n\n' +

              helper.codePrepare(`
                layoutParamsCustomImage${index}.gravity = Gravity.TOP or Gravity.START
                layoutParamsCustomImage${index}.setMargins(${custom.position.margins.side != 0 ? `${custom.position.side}DpCustomImage${index}` : '0'}, 0, ${custom.position.margins.top != 0 ? `topDpCustomImage${index}` : '0'}, 0)

                imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

                frameLayout.addView(imageViewCustomImage${index})\n\n`, 12
              )

            break
          }
          case 'center': {
            customCode += helper.codePrepare(`
              layoutParamsCustomImage${index}.gravity = Gravity.CENTER

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})\n\n`, 10
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

  let menuCode = helper.codePrepare(`
    private fun menu() {
      val frameLayout = FrameLayout(this)
      frameLayout.setBackgroundColor(0xFF000000.toInt())

      val imageView = ImageView(this)
      imageView.setImageResource(R.raw.${menu.background.image})
      imageView.scaleType = ImageView.ScaleType.FIT_CENTER

      frameLayout.addView(imageView)

      val rectangleView = RectangleView(this)

      val layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))
      layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParams
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

      layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)

      buttonAbout.layoutParams = layoutParamsAbout

      buttonAbout.setOnClickListener {
        about(true)
      }

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)

      buttonSettings.layoutParams = layoutParamsSettings

      buttonSettings.setOnClickListener {
        settings(true)
      }

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)

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

      val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))
      layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParamsRectangle
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

      layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)

      buttonAbout.layoutParams = layoutParamsAbout

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)

      buttonSettings.layoutParams = layoutParamsSettings

      buttonSettings.setOnClickListener {
        settings(false)
      }

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)

      buttonSaves.layoutParams = layoutParamsSaves

      buttonSaves.setOnClickListener {
        saves(false)
      }

      frameLayout.addView(buttonSaves)

      val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
      buttonBack.setTextColor(0xFF${menu.backTextColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

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

      val textView = TextView(this)
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
    textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._11ssp))
    textView.setTextColor(0xFF${menu.textColor}.toInt())

    val layoutParamsText = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpText = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp)
    val topDpText = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(leftDpText, topDpText, 0, 0)

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

      val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))
      layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParamsRectangle
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

      layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)

      buttonAbout.layoutParams = layoutParamsAbout

      buttonAbout.setOnClickListener {
        about(false)
      }

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)

      buttonSettings.layoutParams = layoutParamsSettings

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)

      buttonSaves.layoutParams = layoutParamsSaves

      buttonSaves.setOnClickListener {
        saves(false)
      }

      frameLayout.addView(buttonSaves)

      val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
      buttonBack.setTextColor(0xFF${menu.backTextColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

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

      val textViewTextSpeed = TextView(this)
      textViewTextSpeed.text = "Text speed: " + textSpeed.toString() + "ms"
      textViewTextSpeed.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))
      textViewTextSpeed.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsText = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val leftDpTextSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._149sdp)
      val topDpTextSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

      layoutParamsText.gravity = Gravity.TOP or Gravity.START
      layoutParamsText.setMargins(leftDpTextSpeed, topDpTextSpeed, 0, 0)

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

      val heightDpSeekBars = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp)

      val layoutParamsSeekBar = LayoutParams(
        heightDpSeekBars,
        LayoutParams.WRAP_CONTENT
      )

      val leftDpSeekBarSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._135sdp)
      val topDpSeekBarSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._77sdp)

      layoutParamsSeekBar.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBar.setMargins(leftDpSeekBarSpeed, topDpSeekBarSpeed, 0, 0)

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
      textViewMusicVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))
      textViewMusicVolume.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsTextMusicVolume = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val leftDpRightTexts = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._443sdp)
      val topDpTextMusicVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

      layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsTextMusicVolume.setMargins(leftDpRightTexts, topDpTextMusicVolume, 0, 0)

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
        heightDpSeekBars,
        LayoutParams.WRAP_CONTENT
      )

      val leftDpRightSeekbars = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._432sdp)
      val topDpSeekBarMusicVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._77sdp)

      layoutParamsSeekBarMusicVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBarMusicVolume.setMargins(leftDpRightSeekbars, topDpSeekBarMusicVolume, 0, 0)

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
      textViewSEffectVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))
      textViewSEffectVolume.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsTextSEffectVolume = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val topDpSeekBarSEffectVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._111sdp)

      layoutParamsTextSEffectVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsTextSEffectVolume.setMargins(leftDpRightTexts, topDpSeekBarSEffectVolume, 0, 0)

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
        heightDpSeekBars,
        LayoutParams.WRAP_CONTENT
      )

      val topDpTextSEffectVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._135sdp)

      layoutParamsSeekBarSEffectVolume.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBarSEffectVolume.setMargins(leftDpRightSeekbars, topDpTextSEffectVolume, 0, 0)

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
      textViewSceneMusic.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))
      textViewSceneMusic.setTextColor(0xFF${menu.textColor}.toInt())

      val layoutParamsTextSceneMusic = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val topDpSeekBarSceneMusic = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._166sdp)

      layoutParamsTextSceneMusic.gravity = Gravity.TOP or Gravity.START
      layoutParamsTextSceneMusic.setMargins(leftDpRightTexts, topDpSeekBarSceneMusic, 0, 0)

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
        heightDpSeekBars,
        LayoutParams.WRAP_CONTENT
      )

      val topDpTextSceneMusic = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._190sdp)

      layoutParamsSeekBarSceneMusic.gravity = Gravity.TOP or Gravity.START
      layoutParamsSeekBarSceneMusic.setMargins(leftDpRightSeekbars, topDpTextSceneMusic, 0, 0)

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

      val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))
      layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

      rectangleView.layoutParams = layoutParamsRectangle
      rectangleView.setAlpha(${menu.footer.opacity}f)

      frameLayout.addView(rectangleView)

      val buttonStart = Button(this)
      buttonStart.text = "Start"
      buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonStart.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonStart.background = null

      val layoutParamsStart = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

      layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

      buttonStart.layoutParams = layoutParamsStart

      __PERFORVNM_MENU_START__

      frameLayout.addView(buttonStart)

      val buttonAbout = Button(this)
      buttonAbout.text = "About"
      buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonAbout.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonAbout.background = null

      val layoutParamsAbout = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)

      buttonAbout.layoutParams = layoutParamsAbout

      buttonAbout.setOnClickListener {
        about(false)
      }

      frameLayout.addView(buttonAbout)

      val buttonSettings = Button(this)
      buttonSettings.text = "Settings"
      buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSettings.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSettings.background = null

      val layoutParamsSettings = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)

      buttonSettings.layoutParams = layoutParamsSettings

      buttonSettings.setOnClickListener {
        settings(false)
      }

      frameLayout.addView(buttonSettings)

      val buttonSaves = Button(this)
      buttonSaves.text = "Saves"
      buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
      buttonSaves.setTextColor(0xFF${menu.footer.textColor}.toInt())
      buttonSaves.background = null

      val layoutParamsSaves = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
      layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)

      buttonSaves.layoutParams = layoutParamsSaves

      frameLayout.addView(buttonSaves)

      val buttonBack = Button(this)
      buttonBack.text = "Back"
      buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
      buttonBack.setTextColor(0xFF${menu.backTextColor}.toInt())
      buttonBack.background = null

      val layoutParamsBack = LayoutParams(
        LayoutParams.WRAP_CONTENT,
        LayoutParams.WRAP_CONTENT
      )

      layoutParamsBack.gravity = Gravity.TOP or Gravity.START
      layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

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

        val layoutParamsSavesBackground = LayoutParams(
          resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._100sdp),
          resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._70sdp)
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
            resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._100sdp),
            resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._70sdp)
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
