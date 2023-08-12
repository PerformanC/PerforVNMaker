import fs from 'fs'

import helper from './helper.js'

function make(options) {
  if (!options.textColor)
    throw new Error('Menu text color not provided.')

  if (!options.backTextColor)
    throw new Error('Menu "back" text color not provided.')

  if (!options.textSpeed)
    throw new Error('(Menu config) Scenes text speed not provided.')

  if (!options.seekBar?.backgroundColor)
    throw new Error('Seek bar background color not provided.')

  if (!options.seekBar.progressColor)
    throw new Error('Seek bar progress color not provided.')

  if (!options.seekBar.thumbColor)
    throw new Error('Seek bar thumb color not provided.')

  if (!options?.background?.image)
    throw new Error('Menu background image not provided.')

  if (options.background.music) {
    if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.background.music)))
      throw new Error(`Menu background music not found.`)

    visualNovel.internalInfo.menuMusic = true
  }

  if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.background.image)))
    throw new Error('Menu background image not found.')

  if (!options.footer?.color)
    throw new Error('Menu footer color not provided.')

  if (!options.footer.textColor)
    throw new Error('Menu text color not provided.')

  if (!options.footer.opacity)
    throw new Error('Menu footer opacity not provided.')

  console.log('Starting VN, coding menu.. (Android)')

  let mainCode = 'val sharedPreferences = getSharedPreferences("VNConfig", Context.MODE_PRIVATE)' + '\n'

  if (options.background.music) {
    mainCode += `    mediaPlayer = MediaPlayer.create(this, R.raw.${options.background.music})` + '\n\n' +

                '    if (mediaPlayer != null) {' + '\n' +
                '      mediaPlayer!!.start()' + '\n\n' +

                '      val volume = sharedPreferences.getFloat("musicVolume", 1f)' + '\n' +
                '      mediaPlayer!!.setVolume(volume, volume)' + '\n\n' +

                '      mediaPlayer!!.setOnCompletionListener {' + '\n' +
                '        mediaPlayer!!.start()' + '\n' +
                '      }' + '\n' +
                '    }' + '\n\n'
  }

  mainCode += `    textSpeed = sharedPreferences.getLong("textSpeed", ${options.textSpeed}L)` + '\n\n' +

              '    sEffectVolume = sharedPreferences.getFloat("sEffectVolume", 1f)' + '\n\n' +

              '    menu()'

  helper.replace(/__PERFORVNM_MENU__/g, mainCode)

  const menuCode = '  private fun menu() {' + '\n' +
                   '    val frameLayout = FrameLayout(this)' + '\n' +
                   '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                   '    val imageView = ImageView(this)' + '\n' +
                   `    imageView.setImageResource(R.raw.${options.background.image})` + '\n' +
                   '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   '    frameLayout.addView(imageView)' + '\n\n' +

                   '    val rectangleView = RectangleView(this)' + '\n\n' +

                   '    val layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))' + '\n' +
                   '    layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                   '    rectangleView.layoutParams = layoutParams' + '\n' +
                   `    rectangleView.setAlpha(${options.footer.opacity}f)` + '\n\n' +

                   '    frameLayout.addView(rectangleView)' + '\n\n' +

                   '    val buttonStart = Button(this)' + '\n' +
                   '    buttonStart.text = "Start"' + '\n' +
                   '    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                   `    buttonStart.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                   '    buttonStart.background = null' + '\n\n' +

                   '    val layoutParamsStart = LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)' + '\n\n' +

                   '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                   '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                   '    __PERFORVNM_MENU_START__' + '\n\n' +

                   '    frameLayout.addView(buttonStart)' + '\n\n' +

                   '    val buttonAbout = Button(this)' + '\n' +
                   '    buttonAbout.text = "About"' + '\n' +
                   '    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                   `    buttonAbout.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                   '    buttonAbout.background = null' + '\n\n' +

                   '    val layoutParamsAbout = LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                   '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                   '    buttonAbout.setOnClickListener {' + '\n' +
                   '      about(true)' + '\n' +
                   '    }' + '\n\n' +

                   '    frameLayout.addView(buttonAbout)' + '\n\n' +

                   '    val buttonSettings = Button(this)' + '\n' +
                   '    buttonSettings.text = "Settings"' + '\n' +
                   '    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                   `    buttonSettings.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                   '    buttonSettings.background = null' + '\n\n' +

                   '    val layoutParamsSettings = LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                   '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                   '    buttonSettings.setOnClickListener {' + '\n' +
                   '      settings(true)' + '\n' +
                   '    }' + '\n\n' +

                   '    frameLayout.addView(buttonSettings)' + '\n\n' +

                   '    val buttonSaves = Button(this)' + '\n' +
                   '    buttonSaves.text = "Saves"' + '\n' +
                   '    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                   `    buttonSaves.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                   '    buttonSaves.background = null' + '\n\n' +

                   '    val layoutParamsSaves = LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                   '    buttonSaves.layoutParams = layoutParamsSaves' + '\n\n' +

                   '    buttonSaves.setOnClickListener {' + '\n' +
                   '      saves(true)' + '\n' +
                   '    }' + '\n\n' +

                   '    frameLayout.addView(buttonSaves)' + '\n\n' +

                   '    setContentView(frameLayout)' + '\n' +
                   '  }'

  helper.writeScene(menuCode)

  const rectangleViewCode = '\n' + 'class RectangleView(context: Context) : View(context) {' + '\n' +
                            '  private val paint = Paint().apply {' + '\n' +
                            '    color = 0xFF' + options.footer.color + '.toInt()' + '\n' +
                            '    style = Paint.Style.FILL' + '\n' +
                            '  }' + '\n\n' +

                            '  fun setColor(color: Int) {' + '\n' +
                            '    paint.color = color' + '\n' +
                            '  }' + '\n\n' +

                            '  override fun onDraw(canvas: Canvas?) {' + '\n' +
                            '    super.onDraw(canvas)' + '\n' +
                            '    val rect = canvas?.clipBounds ?: return' + '\n' +
                            '    canvas.drawRect(rect, paint)' + '\n' +
                            '  }' + '\n' +
                            '}' + '\n'

  helper.replace('__PERFORVNM_CLASSES__', rectangleViewCode)

  let aboutCode = '  private fun about(animate: Boolean) {' + '\n' +
                    '    val frameLayout = FrameLayout(this)' + '\n' +
                    '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                    '    val imageView = ImageView(this)' + '\n' +
                    `    imageView.setImageResource(R.raw.${options.background.image})` + '\n' +
                    '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    frameLayout.addView(imageView)' + '\n\n' +

                    '    val rectangleGrayView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsGrayRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)' + '\n' +
                    '    layoutParamsGrayRectangle.gravity = Gravity.CENTER' + '\n\n' +

                    '    rectangleGrayView.layoutParams = layoutParamsGrayRectangle' + '\n' +
                    '    rectangleGrayView.setColor(0xFF000000.toInt())' + '\n\n' +

                    '    frameLayout.addView(rectangleGrayView)' + '\n\n' +

                    '    if (animate) {' + '\n' +
                    '      val animationRectangleGray = AlphaAnimation(0f, 0.8f)' + '\n' +
                    '      animationRectangleGray.duration = 500'  + '\n' +
                    '      animationRectangleGray.interpolator = LinearInterpolator()' + '\n' +
                    '      animationRectangleGray.fillAfter = true' + '\n\n' +

                    '      rectangleGrayView.startAnimation(animationRectangleGray)' + '\n' +
                    '    } else {' + '\n' +
                    '      rectangleGrayView.setAlpha(0.8f)' + '\n' +
                    '    }' + '\n\n' +

                    '    val rectangleView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))' + '\n' +
                    '    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                    '    rectangleView.layoutParams = layoutParamsRectangle' + '\n' +
                    `    rectangleView.setAlpha(${options.footer.opacity}f)` + '\n\n' +

                    '    frameLayout.addView(rectangleView)' + '\n\n' +

                    '    val buttonStart = Button(this)' + '\n' +
                    '    buttonStart.text = "Start"' + '\n' +
                    '    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonStart.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonStart.background = null' + '\n\n' +

                    '    val layoutParamsStart = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)' + '\n\n' +

                    '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                    '    __PERFORVNM_MENU_START__' + '\n\n' +

                    '    frameLayout.addView(buttonStart)' + '\n\n' +

                    '    val buttonAbout = Button(this)' + '\n' +
                    '    buttonAbout.text = "About"' + '\n' +
                    '    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonAbout.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonAbout.background = null' + '\n\n' +

                    '    val layoutParamsAbout = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                    '    frameLayout.addView(buttonAbout)' + '\n\n' +

                    '    val buttonSettings = Button(this)' + '\n' +
                    '    buttonSettings.text = "Settings"' + '\n' +
                    '    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonSettings.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonSettings.background = null' + '\n\n' +

                    '    val layoutParamsSettings = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                    '    buttonSettings.setOnClickListener {' + '\n' +
                    '      settings(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonSettings)' + '\n\n' +

                    '    val buttonSaves = Button(this)' + '\n' +
                    '    buttonSaves.text = "Saves"' + '\n' +
                    '    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonSaves.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonSaves.background = null' + '\n\n' +

                    '    val layoutParamsSaves = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonSaves.layoutParams = layoutParamsSaves' + '\n\n' +

                    '    buttonSaves.setOnClickListener {' + '\n' +
                    '      saves(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonSaves)' + '\n\n' +

                    '    val buttonBack = Button(this)' + '\n' +
                    '    buttonBack.text = "Back"' + '\n' +
                    '    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))' + '\n' +
                    `    buttonBack.setTextColor(0xFF${options.backTextColor}.toInt())` + '\n' +
                    '    buttonBack.background = null' + '\n\n' +

                    '    val layoutParamsBack = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)' + '\n\n' +

                    '    buttonBack.layoutParams = layoutParamsBack' + '\n\n' +

                    '    val animationTexts = AlphaAnimation(0f, 1f)' + '\n' +
                    '    animationTexts.duration = 500'  + '\n' +
                    '    animationTexts.interpolator = LinearInterpolator()' + '\n' +
                    '    animationTexts.fillAfter = true' + '\n\n' +

                    '    buttonBack.startAnimation(animationTexts)' + '\n\n' +

                    '    buttonBack.setOnClickListener {' + '\n' +
                    '      menu()' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonBack)' + '\n\n' +

                    '    val textView = TextView(this)' + '\n' +
                    '    textView.text = SpannableStringBuilder().apply {' + '\n' +
                    `      append("${visualNovel.info.fullName} ${visualNovel.info.version}\\n\\nMade with ")` + '\n' +
                    '      append("PerforVNM")' + '\n' +
                    '      setSpan(object : ClickableSpan() {' + '\n' +
                    '        override fun onClick(widget: View) {' + '\n' +
                    `          startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("${PerforVNM.repository}")))` + '\n' +
                    '        }' + '\n' +
                    '      }, length - "PerforVNM".length, length, 0)' + '\n' +
                    `      append(" ${PerforVNM.codeGeneratorVersion} (code generator), ${PerforVNM.generatedCodeVersion} (generated code).")` + '\n'

  if (options.aboutText) {
    aboutCode += `      append("\\n\\n${JSON.stringify(options.aboutText).slice(1, -1)}")` + '\n'
  }

  aboutCode += '    }' + '\n' +
               '    textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._11ssp))' + '\n' +
               `    textView.setTextColor(0xFF${options.textColor}.toInt())` + '\n\n' +

               '    val layoutParamsText = LayoutParams(' + '\n' +
               '      LayoutParams.WRAP_CONTENT,' + '\n' +
               '      LayoutParams.WRAP_CONTENT' + '\n' +
               '    )' + '\n\n' +

               '    val leftDpText = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp)' + '\n' +
               '    val topDpText = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)' + '\n\n' +

               '    layoutParamsText.gravity = Gravity.TOP or Gravity.START' + '\n' +
               '    layoutParamsText.setMargins(leftDpText, topDpText, 0, 0)' + '\n\n' +

               '    textView.layoutParams = layoutParamsText' + '\n' +
               '    textView.startAnimation(animationTexts)' + '\n\n' +

               '    textView.ellipsize = TextUtils.TruncateAt.END' + '\n' +
               '    textView.movementMethod = LinkMovementMethod.getInstance()' + '\n\n' +

               '    frameLayout.addView(textView)' + '\n\n' +

               '    setContentView(frameLayout)' + '\n' +
               '  }'

  helper.writeScene(aboutCode)

  const settingsCode = '  private fun settings(animate: Boolean) {' + '\n' +
                    '    val frameLayout = FrameLayout(this)' + '\n' +
                    '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                    '    val imageView = ImageView(this)' + '\n' +
                    `    imageView.setImageResource(R.raw.${options.background.image})` + '\n' +
                    '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    frameLayout.addView(imageView)' + '\n\n' +

                    '    val rectangleGrayView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsGrayRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)' + '\n' +
                    '    layoutParamsGrayRectangle.gravity = Gravity.CENTER' + '\n\n' +

                    '    rectangleGrayView.layoutParams = layoutParamsGrayRectangle' + '\n' +
                    '    rectangleGrayView.setColor(0xFF000000.toInt())' + '\n\n' +

                    '    frameLayout.addView(rectangleGrayView)' + '\n\n' +

                    '    if (animate) {' + '\n' +
                    '      val animationRectangleGray = AlphaAnimation(0f, 0.8f)' + '\n' +
                    '      animationRectangleGray.duration = 500'  + '\n' +
                    '      animationRectangleGray.interpolator = LinearInterpolator()' + '\n' +
                    '      animationRectangleGray.fillAfter = true' + '\n\n' +

                    '      rectangleGrayView.startAnimation(animationRectangleGray)' + '\n' +
                    '    } else {' + '\n' +
                    '      rectangleGrayView.setAlpha(0.8f)' + '\n' +
                    '    }' + '\n\n' +

                    '    val rectangleView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))' + '\n' +
                    '    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                    '    rectangleView.layoutParams = layoutParamsRectangle' + '\n' +
                    `    rectangleView.setAlpha(${options.footer.opacity}f)` + '\n\n' +

                    '    frameLayout.addView(rectangleView)' + '\n\n' +

                    '    val buttonStart = Button(this)' + '\n' +
                    '    buttonStart.text = "Start"' + '\n' +
                    '    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonStart.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonStart.background = null' + '\n\n' +

                    '    val layoutParamsStart = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)' + '\n\n' +

                    '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                    '    __PERFORVNM_MENU_START__' + '\n\n' +

                    '    frameLayout.addView(buttonStart)' + '\n\n' +

                    '    val buttonAbout = Button(this)' + '\n' +
                    '    buttonAbout.text = "About"' + '\n' +
                    '    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonAbout.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonAbout.background = null' + '\n\n' +

                    '    val layoutParamsAbout = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                    '    buttonAbout.setOnClickListener {' + '\n' +
                    '      about(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonAbout)' + '\n\n' +

                    '    val buttonSettings = Button(this)' + '\n' +
                    '    buttonSettings.text = "Settings"' + '\n' +
                    '    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonSettings.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonSettings.background = null' + '\n\n' +

                    '    val layoutParamsSettings = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                    '    frameLayout.addView(buttonSettings)' + '\n\n' +

                    '    val buttonSaves = Button(this)' + '\n' +
                    '    buttonSaves.text = "Saves"' + '\n' +
                    '    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonSaves.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonSaves.background = null' + '\n\n' +

                    '    val layoutParamsSaves = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonSaves.layoutParams = layoutParamsSaves' + '\n\n' +

                    '    buttonSaves.setOnClickListener {' + '\n' +
                    '      saves(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonSaves)' + '\n\n' +

                    '    val buttonBack = Button(this)' + '\n' +
                    '    buttonBack.text = "Back"' + '\n' +
                    '    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))' + '\n' +
                    `    buttonBack.setTextColor(0xFF${options.backTextColor}.toInt())` + '\n' +
                    '    buttonBack.background = null' + '\n\n' +

                    '    val layoutParamsBack = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)' + '\n\n' +

                    '    buttonBack.layoutParams = layoutParamsBack' + '\n\n' +

                    '    val animationTexts = AlphaAnimation(0f, 1f)' + '\n' +
                    '    animationTexts.duration = 500'  + '\n' +
                    '    animationTexts.interpolator = LinearInterpolator()' + '\n' +
                    '    animationTexts.fillAfter = true' + '\n\n' +

                    '    buttonBack.startAnimation(animationTexts)' + '\n\n' +

                    '    buttonBack.setOnClickListener {' + '\n' +
                    '      menu()' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonBack)' + '\n\n' +

                    '    val textViewTextSpeed = TextView(this)' + '\n' +
                    '    textViewTextSpeed.text = "Text speed: " + textSpeed.toString() + "ms"' + '\n' +
                    '    textViewTextSpeed.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))' + '\n' +
                    `    textViewTextSpeed.setTextColor(0xFF${options.textColor}.toInt())` + '\n\n' +

                    '    val layoutParamsText = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpTextSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._149sdp)' + '\n' +
                    '    val topDpTextSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)' + '\n\n' +

                    '    layoutParamsText.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsText.setMargins(leftDpTextSpeed, topDpTextSpeed, 0, 0)' + '\n\n' +

                    '    textViewTextSpeed.layoutParams = layoutParamsText' + '\n' +
                    '    textViewTextSpeed.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewTextSpeed)' + '\n\n' +

                    '    val seekBarTextSpeed = SeekBar(this)' + '\n' +
                    '    seekBarTextSpeed.max = 100' + '\n' +
                    '    seekBarTextSpeed.progress = textSpeed.toInt()' + '\n\n' +

                    '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarTextSpeed.thumbOffset = 0' + '\n\n' +

                    '    val heightDpSeekBars = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp)' + '\n\n' +

                    '    val layoutParamsSeekBar = LayoutParams(' + '\n' +
                    '      heightDpSeekBars,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpSeekBarSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._135sdp)' + '\n' +
                    '    val topDpSeekBarSpeed = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._77sdp)' + '\n\n' +

                    '    layoutParamsSeekBar.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsSeekBar.setMargins(leftDpSeekBarSpeed, topDpSeekBarSpeed, 0, 0)' + '\n\n' +

                    '    seekBarTextSpeed.layoutParams = layoutParamsSeekBar' + '\n' +
                    '    seekBarTextSpeed.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(seekBarTextSpeed)' + '\n\n' +

                    '    val sharedPreferences = getSharedPreferences("VNConfig", Context.MODE_PRIVATE)' + '\n' +
                    '    val editor = sharedPreferences.edit()' + '\n\n' +

                    '    seekBarTextSpeed.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {' + '\n' +
                    '      override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {' + '\n' +
                    '        if (fromUser) {' + '\n' +
                    '          textViewTextSpeed.text = "Text speed: " + progress.toString() + "ms"' + '\n' +
                    '          textSpeed = progress.toLong()' + '\n\n' +

                    '          editor.putLong("textSpeed", progress.toLong())' + '\n' +
                    '          editor.apply()' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n\n' +

                    '      override fun onStartTrackingTouch(seekBar: SeekBar?) {}' + '\n\n' +

                    '      override fun onStopTrackingTouch(seekBar: SeekBar?) {}' + '\n' +
                    '    })' + '\n\n' +

                    '    val musicVolume = sharedPreferences.getFloat("musicVolume", 1f)' + '\n\n' +

                    '    val textViewMusicVolume = TextView(this)' + '\n' +
                    '    textViewMusicVolume.text = "Menu music: " + (musicVolume * 100).toInt().toString() + "%"' + '\n' +
                    '    textViewMusicVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))' + '\n' +
                    `    textViewMusicVolume.setTextColor(0xFF${options.textColor}.toInt())` + '\n\n' +

                    '    val layoutParamsTextMusicVolume = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpRightTexts = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._443sdp)' + '\n' +
                    '    val topDpTextMusicVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)' + '\n\n' +

                    '    layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsTextMusicVolume.setMargins(leftDpRightTexts, topDpTextMusicVolume, 0, 0)' + '\n\n' +

                    '    textViewMusicVolume.layoutParams = layoutParamsTextMusicVolume' + '\n' +
                    '    textViewMusicVolume.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewMusicVolume)' + '\n\n' +

                    '    val seekBarMusicVolume = SeekBar(this)' + '\n' +
                    '    seekBarMusicVolume.max = 100' + '\n' +
                    '    seekBarMusicVolume.progress = (musicVolume * 100).toInt()' + '\n\n' +

                    '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarMusicVolume.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBarMusicVolume = LayoutParams(' + '\n' +
                    '      heightDpSeekBars,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpRightSeekbars = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._432sdp)' + '\n' +
                    '    val topDpSeekBarMusicVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._77sdp)' + '\n\n' +

                    '    layoutParamsSeekBarMusicVolume.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsSeekBarMusicVolume.setMargins(leftDpRightSeekbars, topDpSeekBarMusicVolume, 0, 0)' + '\n\n' +

                    '    seekBarMusicVolume.layoutParams = layoutParamsSeekBarMusicVolume' + '\n' +
                    '    seekBarMusicVolume.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(seekBarMusicVolume)' + '\n\n' +

                    '    seekBarMusicVolume.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {' + '\n' +
                    '      override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {' + '\n' +
                    '        if (fromUser) {' + '\n' +
                    '          textViewMusicVolume.text = "Menu music: " + progress.toString() + "%"' + '\n\n' +

                    '          editor.putFloat("musicVolume", progress.toFloat() / 100)' + '\n' +
                    '          editor.apply()' + '\n\n' +

                    '          mediaPlayer?.setVolume(progress.toFloat() / 100, progress.toFloat() / 100)' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n\n' +

                    '      override fun onStartTrackingTouch(seekBar: SeekBar?) {}' + '\n\n' +

                    '      override fun onStopTrackingTouch(seekBar: SeekBar?) {}' + '\n' +
                    '    })' + '\n\n' +

                    '    val textViewSEffectVolume = TextView(this)' + '\n' +
                    '    textViewSEffectVolume.text = "Sound effects: " + (sEffectVolume * 100).toInt().toString() + "%"' + '\n' +
                    '    textViewSEffectVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))' + '\n' +
                    `    textViewSEffectVolume.setTextColor(0xFF${options.textColor}.toInt())` + '\n\n' +

                    '    val layoutParamsTextSEffectVolume = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpSeekBarSEffectVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._111sdp)' + '\n\n' +

                    '    layoutParamsTextSEffectVolume.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsTextSEffectVolume.setMargins(leftDpRightTexts, topDpSeekBarSEffectVolume, 0, 0)' + '\n\n' +

                    '    textViewSEffectVolume.layoutParams = layoutParamsTextSEffectVolume' + '\n' +
                    '    textViewSEffectVolume.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewSEffectVolume)' + '\n\n' +

                    '    val seekBarSEffectVolume = SeekBar(this)' + '\n' +
                    '    seekBarSEffectVolume.max = 100' + '\n' +
                    '    seekBarSEffectVolume.progress = (sEffectVolume * 100).toInt()' + '\n\n' +

                    '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarSEffectVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarSEffectVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSEffectVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSEffectVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarSEffectVolume.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBarSEffectVolume = LayoutParams(' + '\n' +
                    '      heightDpSeekBars,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpTextSEffectVolume = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._135sdp)' + '\n\n' +

                    '    layoutParamsSeekBarSEffectVolume.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsSeekBarSEffectVolume.setMargins(leftDpRightSeekbars, topDpTextSEffectVolume, 0, 0)' + '\n\n' +

                    '    seekBarSEffectVolume.layoutParams = layoutParamsSeekBarSEffectVolume' + '\n' +
                    '    seekBarSEffectVolume.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(seekBarSEffectVolume)' + '\n\n' +

                    '    seekBarSEffectVolume.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {' + '\n' +
                    '      override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {' + '\n' +
                    '        if (fromUser) {' + '\n' +
                    '          textViewSEffectVolume.text = "Sound effects: " + progress.toString() + "%"' + '\n\n' +

                    '          sEffectVolume = progress.toFloat() / 100' + '\n\n' +

                    '          editor.putFloat("sEffectVolume", sEffectVolume)' + '\n' +
                    '          editor.apply()' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n\n' +

                    '      override fun onStartTrackingTouch(seekBar: SeekBar?) {}' + '\n\n' +

                    '      override fun onStopTrackingTouch(seekBar: SeekBar?) {}' + '\n' +
                    '    })' + '\n\n' +

                    '    val textViewSceneMusic = TextView(this)' + '\n' +
                    '    textViewSceneMusic.text = "Scene music: " + (sceneMusicVolume * 100).toInt().toString() + "%"' + '\n' +
                    '    textViewSceneMusic.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._16ssp))' + '\n' +
                    `    textViewSceneMusic.setTextColor(0xFF${options.textColor}.toInt())` + '\n\n' +

                    '    val layoutParamsTextSceneMusic = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpSeekBarSceneMusic = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._166sdp)' + '\n\n' +

                    '    layoutParamsTextSceneMusic.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsTextSceneMusic.setMargins(leftDpRightTexts, topDpSeekBarSceneMusic, 0, 0)' + '\n\n' +

                    '    textViewSceneMusic.layoutParams = layoutParamsTextSceneMusic' + '\n' +
                    '    textViewSceneMusic.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewSceneMusic)' + '\n\n' +

                    '    val seekBarSceneMusic = SeekBar(this)' + '\n' +
                    '    seekBarSceneMusic.max = 100' + '\n' +
                    '    seekBarSceneMusic.progress = (sceneMusicVolume * 100).toInt()' + '\n\n' +

                    '    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarSceneMusic.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarSceneMusic.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSceneMusic.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSceneMusic.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarSceneMusic.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBarSceneMusic = LayoutParams(' + '\n' +
                    '      heightDpSeekBars,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpTextSceneMusic = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._190sdp)' + '\n\n' +

                    '    layoutParamsSeekBarSceneMusic.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsSeekBarSceneMusic.setMargins(leftDpRightSeekbars, topDpTextSceneMusic, 0, 0)' + '\n\n' +

                    '    seekBarSceneMusic.layoutParams = layoutParamsSeekBarSceneMusic' + '\n' +
                    '    seekBarSceneMusic.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(seekBarSceneMusic)' + '\n\n' +

                    '    seekBarSceneMusic.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {' + '\n' +
                    '      override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {' + '\n' +
                    '        if (fromUser) {' + '\n' +
                    '          textViewSceneMusic.text = "Scene music: " + progress.toString() + "%"' + '\n\n' +

                    '          sceneMusicVolume = progress.toFloat() / 100' + '\n\n' +

                    '          editor.putFloat("sceneMusicVolume", sceneMusicVolume)' + '\n' +
                    '          editor.apply()' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n\n' +

                    '      override fun onStartTrackingTouch(seekBar: SeekBar?) {}' + '\n\n' +

                    '      override fun onStopTrackingTouch(seekBar: SeekBar?) {}' + '\n' +
                    '    })' + '\n\n' +

                    '    setContentView(frameLayout)' + '\n' +
                    '  }'

  helper.writeScene(settingsCode)

  visualNovel.customXML.push({
    path: 'drawable/custom_seekbar_progress.xml',
    content: '<layer-list xmlns:android="http://schemas.android.com/apk/res/android">' + '\n' +
             '  <item android:id="@android:id/background">' + '\n' +
             '    <shape android:shape="rectangle">' + '\n' +
             `      <solid android:color="#${options.seekBar.backgroundColor}" />` + '\n' +
             '      <size android:height="@dimen/_13sdp" />' + '\n' +
             '    </shape>' + '\n' +
             '  </item>' + '\n' +
             '  <item android:id="@android:id/progress">' + '\n' +
             '    <clip>' + '\n' +
             '      <shape android:shape="rectangle">' + '\n' +
             `        <solid android:color="#${options.seekBar.progressColor}" />` + '\n' +
             '        <size android:height="@dimen/_13sdp" />' + '\n' +
             '      </shape>' + '\n' +
             '    </clip>' + '\n' +
             '  </item>' + '\n' +
             '</layer-list>'
  })

  visualNovel.customXML.push({
    path: 'drawable/custom_seekbar_thumb.xml',
    content: '<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">' + '\n' +
             `  <solid android:color="#${options.seekBar.thumbColor}" />` + '\n' +
             '  <size android:width="@dimen/_7sdp" android:height="@dimen/_13sdp" />' + '\n' +
             '</shape>'
  })

  const saverCode = '  private fun saves(animate: Boolean) {' + '\n' +
                    '    val frameLayout = FrameLayout(this)' + '\n' +
                    '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                    '    val imageView = ImageView(this)' + '\n' +
                    `    imageView.setImageResource(R.raw.${options.background.image})` + '\n' +
                    '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    frameLayout.addView(imageView)' + '\n\n' +

                    '    val rectangleGrayView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsGrayRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)' + '\n' +
                    '    layoutParamsGrayRectangle.gravity = Gravity.CENTER' + '\n\n' +

                    '    rectangleGrayView.layoutParams = layoutParamsGrayRectangle' + '\n' +
                    '    rectangleGrayView.setColor(0xFF000000.toInt())' + '\n\n' +

                    '    frameLayout.addView(rectangleGrayView)' + '\n\n' +

                    '    if (animate) {' + '\n' +
                    '      val animationRectangleGray = AlphaAnimation(0f, 0.8f)' + '\n' +
                    '      animationRectangleGray.duration = 500'  + '\n' +
                    '      animationRectangleGray.interpolator = LinearInterpolator()' + '\n' +
                    '      animationRectangleGray.fillAfter = true' + '\n\n' +

                    '      rectangleGrayView.startAnimation(animationRectangleGray)' + '\n' +
                    '    } else {' + '\n' +
                    '      rectangleGrayView.setAlpha(0.8f)' + '\n' +
                    '    }' + '\n\n' +

                    '    val rectangleView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))' + '\n' +
                    '    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                    '    rectangleView.layoutParams = layoutParamsRectangle' + '\n' +
                    `    rectangleView.setAlpha(${options.footer.opacity}f)` + '\n\n' +

                    '    frameLayout.addView(rectangleView)' + '\n\n' +

                    '    val buttonStart = Button(this)' + '\n' +
                    '    buttonStart.text = "Start"' + '\n' +
                    '    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonStart.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonStart.background = null' + '\n\n' +

                    '    val layoutParamsStart = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)' + '\n\n' +

                    '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                    '    __PERFORVNM_MENU_START__' + '\n\n' +

                    '    frameLayout.addView(buttonStart)' + '\n\n' +

                    '    val buttonAbout = Button(this)' + '\n' +
                    '    buttonAbout.text = "About"' + '\n' +
                    '    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonAbout.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonAbout.background = null' + '\n\n' +

                    '    val layoutParamsAbout = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                    '    buttonAbout.setOnClickListener {' + '\n' +
                    '      about(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonAbout)' + '\n\n' +

                    '    val buttonSettings = Button(this)' + '\n' +
                    '    buttonSettings.text = "Settings"' + '\n' +
                    '    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonSettings.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonSettings.background = null' + '\n\n' +

                    '    val layoutParamsSettings = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                    '    buttonSettings.setOnClickListener {' + '\n' +
                    '      settings(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonSettings)' + '\n\n' +

                    '    val buttonSaves = Button(this)' + '\n' +
                    '    buttonSaves.text = "Saves"' + '\n' +
                    '    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))' + '\n' +
                    `    buttonSaves.setTextColor(0xFF${options.footer.textColor}.toInt())` + '\n' +
                    '    buttonSaves.background = null' + '\n\n' +

                    '    val layoutParamsSaves = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, bottomDpButtons)' + '\n\n' +

                    '    buttonSaves.layoutParams = layoutParamsSaves' + '\n\n' +

                    '    frameLayout.addView(buttonSaves)' + '\n\n' +

                    '    val buttonBack = Button(this)' + '\n' +
                    '    buttonBack.text = "Back"' + '\n' +
                    '    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))' + '\n' +
                    `    buttonBack.setTextColor(0xFF${options.backTextColor}.toInt())` + '\n' +
                    '    buttonBack.background = null' + '\n\n' +

                    '    val layoutParamsBack = LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)' + '\n\n' +

                    '    buttonBack.layoutParams = layoutParamsBack' + '\n\n' +

                    '    val animationTexts = AlphaAnimation(0f, 1f)' + '\n' +
                    '    animationTexts.duration = 500'  + '\n' +
                    '    animationTexts.interpolator = LinearInterpolator()' + '\n' +
                    '    animationTexts.fillAfter = true' + '\n\n' +

                    '    buttonBack.startAnimation(animationTexts)' + '\n\n' +

                    '    buttonBack.setOnClickListener {' + '\n' +
                    '      menu()' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonBack)' + '\n\n' +

                    '    val scrollView = ScrollView(this)' + '\n\n' +

                    '    scrollView.layoutParams = LayoutParams(' + '\n' +
                    '      LayoutParams.MATCH_PARENT,' + '\n' +
                    '      LayoutParams.MATCH_PARENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val frameLayoutScenes = FrameLayout(this)' + '\n\n' +

                    '    val inputStream = openFileInput("saves.json")' + '\n' +
                    '    val text = inputStream.bufferedReader().use { it.readText() }' + '\n' +
                    '    inputStream.close()' + '\n\n' +

                    '    val saves = JSONArray(text)' + '\n\n' +

                    '    var leftDp = 100' + '\n' +
                    '    var topDp = 50' + '\n\n' +

                    '    for (i in 0 until saves.length()) {' + '\n' +
                    '      val buttonData = saves.getJSONObject(i)' + '\n\n' +

                    '      val relativeLayout = RelativeLayout(this)' + '\n\n' +
                    '      val layoutParamsRelativeLayout = LayoutParams(' + '\n' +
                    '        resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._100sdp),' + '\n' +
                    '        resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._70sdp)' + '\n' +
                    '       )' + '\n\n' +

                    '      if (i != 0) {' + '\n' +
                    '        if (i % 4 == 0) {' + '\n' +
                    '          leftDp = 100' + '\n' +
                    '          topDp += 100' + '\n' +
                    '        } else {' + '\n' +
                    '          leftDp += 133' + '\n' +
                    '        }' + '\n' +
                    '      }' + '\n\n' +

                    '      val leftDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_${leftDp}sdp", "dimen", getPackageName()))' + '\n' +
                    '      val topDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_${topDp}sdp", "dimen", getPackageName()))' + '\n\n' +

                    '      layoutParamsRelativeLayout.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '      layoutParamsRelativeLayout.setMargins(leftDpLoad, topDpLoad, 0, 0)' + '\n\n' +

                    '      relativeLayout.layoutParams = layoutParamsRelativeLayout' + '\n\n' +

                    '      val rectangleScene = RectangleView(this)' + '\n' +
                    '      rectangleScene.setColor(0xFF000000.toInt())' + '\n\n' +

                    '      val layoutParamsRectangleScene = RelativeLayout.LayoutParams(' + '\n' +
                    '        RelativeLayout.LayoutParams.MATCH_PARENT,' + '\n' +
                    '        RelativeLayout.LayoutParams.MATCH_PARENT' + '\n' +
                    '      )' + '\n\n' +

                    '      layoutParamsRectangleScene.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE)' + '\n\n' +

                    '      rectangleScene.layoutParams = layoutParamsRectangleScene' + '\n\n' +

                    '      rectangleScene.setOnClickListener {' + '\n' +
                    '        __PERFORVNM_RELEASE_MEDIA_PLAYER__' + '\n\n' +

                    '        __PERFORVNM_SWITCHES__' + '\n' +
                    '      }' + '\n\n' +

                    '      relativeLayout.addView(rectangleScene)' + '\n\n' +

                    // TODO: Only apply scenario if it exists, add characters and remove rectangleScene if scenario is available

                    '      val imageViewScenario = ImageView(this)' + '\n' +
                    '      imageViewScenario.setImageResource(resources.getIdentifier(buttonData.getString("scenario"), "raw", getPackageName()))' + '\n\n' +

                    '      val layoutParamsImageViewScenario = RelativeLayout.LayoutParams(' + '\n' +
                    '        RelativeLayout.LayoutParams.MATCH_PARENT,' + '\n' +
                    '        RelativeLayout.LayoutParams.MATCH_PARENT' + '\n' +
                    '      )' + '\n\n' +

                    '      layoutParamsImageViewScenario.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE)' + '\n\n' +

                    '      imageViewScenario.layoutParams = layoutParamsImageViewScenario' + '\n\n' +

                    '      relativeLayout.addView(imageViewScenario)' + '\n\n' +

                    '      frameLayoutScenes.addView(relativeLayout)' + '\n' +
                    '    }' + '\n\n' +

                    '    scrollView.addView(frameLayoutScenes)' + '\n\n' +

                    '    frameLayout.addView(scrollView)' + '\n\n' +

                    '    setContentView(frameLayout)' + '\n' +
                    '  }'

  helper.writeScene(saverCode)

  visualNovel.menu = {
    name: 'menu()',
    backgroundMusic: options.background.music,
    options
  }

  console.log('Menu coded. (Android)')
}

export default {
  make
}
