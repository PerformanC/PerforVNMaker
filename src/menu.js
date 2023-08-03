import fs from 'fs'

import helper from './helper.js'

function make(options) {
  if (!options.textColor) {
    console.error('ERROR: Menu text color not provided.')

    process.exit(1)
  }

  if (!options.backTextColor) {
    console.error('ERROR: Menu "back" text color not provided.')

    process.exit(1)
  }

  if (!options.textSpeed) {
    console.error('ERROR: (Menu config) Scenes text speed not provided.')

    process.exit(1)
  }

  if (!options.seekBar?.backgroundColor) {
    console.error('ERROR: Seek bar background color not provided.')

    process.exit(1)
  }

  if (!options.seekBar.progressColor) {
    console.error('ERROR: Seek bar progress color not provided.')

    process.exit(1)
  }

  if (!options.seekBar.thumbColor) {
    console.error('ERROR: Seek bar thumb color not provided.')

    process.exit(1)
  }

  if (!options?.background?.image) {
    console.error('ERROR: Menu background image not provided.')

    process.exit(1)
  }

  if (options.background.music) {
    if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.background.music))) {
      console.error(`ERROR: Menu background music not found.`)
  
      process.exit(1)
    }

    visualNovel.internalInfo.menuMusic = true
  }

  if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.background.image))) {
    console.error('ERROR: Menu background image not found.')

    process.exit(1)
  }

  if (!options.footer?.color) {
    console.error('ERROR: Menu footer color not provided.')

    process.exit(1)
  }

  if (!options.footer.textColor) {
    console.error('ERROR: Menu text color not provided.')

    process.exit(1)
  }

  if (!options.footer.opacity) {
    console.error('ERROR: Menu footer opacity not provided.')

    process.exit(1)
  }

  console.log('Starting VN, coding menu.. (Android)')

  const mainCode = 'val sharedPreferences = getSharedPreferences("VNConfig", Context.MODE_PRIVATE)' + '\n' +
                   (options.background.music ? '      mediaPlayer = MediaPlayer.create(this, R.raw.' + options.background.music + ')' + '\n\n' +

                   '      if (mediaPlayer != null) {' + '\n' +
                   '        mediaPlayer!!.start()' + '\n\n' +

                   '        val volume = sharedPreferences.getFloat("musicVolume", 1f)' + '\n' +
                   '        mediaPlayer!!.setVolume(volume, volume)' + '\n\n' +
                  
                   '        mediaPlayer!!.setOnCompletionListener {' + '\n' +
                   '          mediaPlayer!!.start()' + '\n' +
                   '        }' + '\n' +
                   '      }' + '\n\n' : '') +

                   '      textSpeed = sharedPreferences.getLong("textSpeed", ' + options.textSpeed + 'L)' + '\n\n' +

                   '      sEffectVolume = sharedPreferences.getFloat("sEffectVolume", 1f)' + '\n\n' +

                   '      menu()'

  helper.replace(/__PERFORVNM_MENU__/g, mainCode)

  const menuCode = '  private fun menu() {' + '\n' +
                   '    val frameLayout = FrameLayout(this)' + '\n' +
                   '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                   '    val imageView = ImageView(this)' + '\n' +
                   '    imageView.setImageResource(R.raw.' + options.background.image + ')' + '\n' +
                   '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   '    frameLayout.addView(imageView)' + '\n\n' +

                   '    val rectangleView = RectangleView(this)' + '\n\n' +

                   '    val layoutParams = FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT, (displayMetrics.heightPixels * 0.09259259259).toInt())' + '\n' +
                   '    layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +
 
                   '    rectangleView.layoutParams = layoutParams' + '\n' +
                   '    rectangleView.setAlpha(' + options.footer.opacity + 'f)' + '\n\n' +

                   '    frameLayout.addView(rectangleView)' + '\n\n' +

                   '    val buttonStart = Button(this)' + '\n' +
                   '    buttonStart.text = "Start"' + '\n' +
                   '    buttonStart.textSize = 15f' + '\n' +
                   '    buttonStart.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                   '    buttonStart.background = null' + '\n\n' +

                   '    val layoutParamsStart = FrameLayout.LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsStart.setMargins(300, 0, 50, -10)' + '\n\n' +

                   '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                   '    __PERFORVNM_MENU_START__' + '\n\n' +

                   '    frameLayout.addView(buttonStart)' + '\n\n' +

                   '    val buttonAbout = Button(this)' + '\n' +
                   '    buttonAbout.text = "About"' + '\n' +
                   '    buttonAbout.textSize = 15f' + '\n' +
                   '    buttonAbout.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                   '    buttonAbout.background = null' + '\n\n' +

                   '    val layoutParamsAbout = FrameLayout.LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsAbout.setMargins(550, 0, 0, -10)' + '\n\n' +

                   '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                   '    buttonAbout.setOnClickListener {' + '\n' +
                   '      about(true)' + '\n' +
                   '    }' + '\n\n' +

                   '    frameLayout.addView(buttonAbout)' + '\n\n' +

                   '    val buttonSettings = Button(this)' + '\n' +
                   '    buttonSettings.text = "Settings"' + '\n' +
                   '    buttonSettings.textSize = 15f' + '\n' +
                   '    buttonSettings.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                   '    buttonSettings.background = null' + '\n\n' +

                   '    val layoutParamsSettings = FrameLayout.LayoutParams(' + '\n' +
                   '      LayoutParams.WRAP_CONTENT,' + '\n' +
                   '      LayoutParams.WRAP_CONTENT' + '\n' +
                   '    )' + '\n\n' +

                   '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                   '    layoutParamsSettings.setMargins(800, 0, 0, -10)' + '\n\n' +

                   '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                   '    buttonSettings.setOnClickListener {' + '\n' +
                   '      settings(true)' + '\n' +
                   '    }' + '\n\n' +

                   '    frameLayout.addView(buttonSettings)' + '\n\n' +

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

  const aboutCode = '  private fun about(animate: Boolean) {' + '\n' +
                    '    val frameLayout = FrameLayout(this)' + '\n' +
                    '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                    '    val imageView = ImageView(this)' + '\n' +
                    '    imageView.setImageResource(R.raw.' + options.background.image + ')' + '\n' +
                    '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    frameLayout.addView(imageView)' + '\n\n' +

                    '    val rectangleGrayView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsGrayRectangle = FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)' + '\n' +
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

                    '    val layoutParamsRectangle = FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT, (displayMetrics.heightPixels * 0.09259259259).toInt())' + '\n' +
                    '    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                    '    rectangleView.layoutParams = layoutParamsRectangle' + '\n' +
                    '    rectangleView.setAlpha(' + options.footer.opacity + 'f)' + '\n\n' +

                    '    frameLayout.addView(rectangleView)' + '\n\n' +

                    '    val buttonStart = Button(this)' + '\n' +
                    '    buttonStart.text = "Start"' + '\n' +
                    '    buttonStart.textSize = 15f' + '\n' +
                    '    buttonStart.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                    '    buttonStart.background = null' + '\n\n' +

                    '    val layoutParamsStart = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsStart.setMargins(300, 0, 0, -10)' + '\n\n' +

                    '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                    '    __PERFORVNM_MENU_START__' + '\n\n' +

                    '    frameLayout.addView(buttonStart)' + '\n\n' +

                    '    val buttonAbout = Button(this)' + '\n' +
                    '    buttonAbout.text = "About"' + '\n' +
                    '    buttonAbout.textSize = 15f' + '\n' +
                    '    buttonAbout.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                    '    buttonAbout.background = null' + '\n\n' +

                    '    val layoutParamsAbout = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsAbout.setMargins(550, 0, 0, -10)' + '\n\n' +

                    '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                    '    frameLayout.addView(buttonAbout)' + '\n\n' +

                    '    val buttonSettings = Button(this)' + '\n' +
                    '    buttonSettings.text = "Settings"' + '\n' +
                    '    buttonSettings.textSize = 15f' + '\n' +
                    '    buttonSettings.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                    '    buttonSettings.background = null' + '\n\n' +

                    '    val layoutParamsSettings = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSettings.setMargins(800, 0, 0, -10)' + '\n\n' +

                    '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                    '    buttonSettings.setOnClickListener {' + '\n' +
                    '      settings(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonSettings)' + '\n\n' +

                    '    val buttonBack = Button(this)' + '\n' +
                    '    buttonBack.text = "Back"' + '\n' +
                    '    buttonBack.textSize = 20f' + '\n' +
                    '    buttonBack.setTextColor(0xFF' + options.backTextColor + '.toInt())' + '\n' +
                    '    buttonBack.background = null' + '\n\n' +

                    '    val layoutParamsBack = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsBack.setMargins(250, 0, 0, 0)' + '\n\n' +

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
                    '      append("' + visualNovel.info.fullName + ' ' + visualNovel.info.version + '\\n\\nMade with ")' + '\n' +
                    '      append("PerforVNM")' + '\n' +
                    '      setSpan(object : ClickableSpan() {' + '\n' +
                    '        override fun onClick(widget: View) {' + '\n' +
                    '          startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("' + PerforVNM.repository + '")))' + '\n' +
                    '        }' + '\n' +
                    '      }, length - "PerforVNM".length, length, 0)' + '\n' +
                    '      append(" ' + PerforVNM.codeGeneratorVersion + ' (code generator), ' + PerforVNM.generatedCodeVersion + ' (generated code).")' + '\n' +
                    '    }' + '\n' +
                    '    textView.textSize = 15f' + '\n' +
                    '    textView.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsText = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsText.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsText.setMargins(300, 200, 0, 0)' + '\n\n' +

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
                    '    imageView.setImageResource(R.raw.' + options.background.image + ')' + '\n' +
                    '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    frameLayout.addView(imageView)' + '\n\n' +

                    '    val rectangleGrayView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsGrayRectangle = FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT)' + '\n' +
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

                    '    val layoutParamsRectangle = FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT, (displayMetrics.heightPixels * 0.09259259259).toInt())' + '\n' +
                    '    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL' + '\n\n' +

                    '    rectangleView.layoutParams = layoutParamsRectangle' + '\n' +
                    '    rectangleView.setAlpha(' + options.footer.opacity + 'f)' + '\n\n' +

                    '    frameLayout.addView(rectangleView)' + '\n\n' +

                    '    val buttonStart = Button(this)' + '\n' +
                    '    buttonStart.text = "Start"' + '\n' +
                    '    buttonStart.textSize = 15f' + '\n' +
                    '    buttonStart.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                    '    buttonStart.background = null' + '\n\n' +

                    '    val layoutParamsStart = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsStart.setMargins(300, 0, 0, -10)' + '\n\n' +

                    '    buttonStart.layoutParams = layoutParamsStart' + '\n\n' +

                    '    __PERFORVNM_MENU_START__' + '\n\n' +

                    '    frameLayout.addView(buttonStart)' + '\n\n' +

                    '    val buttonAbout = Button(this)' + '\n' +
                    '    buttonAbout.text = "About"' + '\n' +
                    '    buttonAbout.textSize = 15f' + '\n' +
                    '    buttonAbout.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                    '    buttonAbout.background = null' + '\n\n' +

                    '    val layoutParamsAbout = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsAbout.setMargins(550, 0, 0, -10)' + '\n\n' +

                    '    buttonAbout.layoutParams = layoutParamsAbout' + '\n\n' +

                    '    buttonAbout.setOnClickListener {' + '\n' +
                    '      about(false)' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(buttonAbout)' + '\n\n' +

                    '    val buttonSettings = Button(this)' + '\n' +
                    '    buttonSettings.text = "Settings"' + '\n' +
                    '    buttonSettings.textSize = 15f' + '\n' +
                    '    buttonSettings.setTextColor(0xFF' + options.footer.textColor + '.toInt())' + '\n' +
                    '    buttonSettings.background = null' + '\n\n' +

                    '    val layoutParamsSettings = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START' + '\n' +
                    '    layoutParamsSettings.setMargins(800, 0, 0, -10)' + '\n\n' +

                    '    buttonSettings.layoutParams = layoutParamsSettings' + '\n\n' +

                    '    frameLayout.addView(buttonSettings)' + '\n\n' +

                    '    val buttonBack = Button(this)' + '\n' +
                    '    buttonBack.text = "Back"' + '\n' +
                    '    buttonBack.textSize = 20f' + '\n' +
                    '    buttonBack.setTextColor(0xFF' + options.backTextColor + '.toInt())' + '\n' +
                    '    buttonBack.background = null' + '\n\n' +

                    '    val layoutParamsBack = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsBack.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsBack.setMargins(250, 0, 0, 0)' + '\n\n' +

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
                    '    textViewTextSpeed.textSize = 15f' + '\n' +
                    '    textViewTextSpeed.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsText = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val resourceDisplayMetrics: DisplayMetrics = getResources().getDisplayMetrics()' + '\n\n' +

                    '    val leftDpTextSpeed: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 204f, resourceDisplayMetrics).toInt()' + '\n' +
                    '    val topDpTextSpeed: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 77f, resourceDisplayMetrics).toInt()' + '\n\n' +

                    '    layoutParamsText.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsText.setMargins(leftDpTextSpeed, topDpTextSpeed, 0, 0)' + '\n\n' +

                    '    textViewTextSpeed.layoutParams = layoutParamsText' + '\n' +
                    '    textViewTextSpeed.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewTextSpeed)' + '\n\n' +

                    '    val seekBarTextSpeed = SeekBar(this)' + '\n' +
                    '    seekBarTextSpeed.max = 100' + '\n' +
                    '    seekBarTextSpeed.progress = textSpeed.toInt()' + '\n\n' +

                    '    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarTextSpeed.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBar = FrameLayout.LayoutParams(' + '\n' +
                    '      500,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpSeekBarSpeed: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 188f, resourceDisplayMetrics).toInt()' + '\n' +
                    '    val topDpSeekBarSpeed: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 100f, resourceDisplayMetrics).toInt()' + '\n\n' +

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
                    '    textViewMusicVolume.textSize = 15f' + '\n' +
                    '    textViewMusicVolume.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsTextMusicVolume = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpRightTexts: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 591f, resourceDisplayMetrics).toInt()' + '\n' +
                    '    val topDpTextMusicVolume: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 77f, resourceDisplayMetrics).toInt()' + '\n\n' +

                    '    layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsTextMusicVolume.setMargins(leftDpRightTexts, topDpTextMusicVolume, 0, 0)' + '\n\n' +

                    '    textViewMusicVolume.layoutParams = layoutParamsTextMusicVolume' + '\n' +
                    '    textViewMusicVolume.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewMusicVolume)' + '\n\n' +

                    '    val seekBarMusicVolume = SeekBar(this)' + '\n' +
                    '    seekBarMusicVolume.max = 100' + '\n' +
                    '    seekBarMusicVolume.progress = (musicVolume * 100).toInt()' + '\n\n' +

                    '    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarMusicVolume.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBarMusicVolume = FrameLayout.LayoutParams(' + '\n' +
                    '      500,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val leftDpRightSeekbars: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 576f, resourceDisplayMetrics).toInt()' + '\n' +
                    '    val topDpSeekBarMusicVolume: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 100f, resourceDisplayMetrics).toInt()' + '\n\n' +

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
                    '    textViewSEffectVolume.textSize = 15f' + '\n' +
                    '    textViewSEffectVolume.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsTextSEffectVolume = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpSeekBarSEffectVolume: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 126f, resourceDisplayMetrics).toInt()' + '\n\n' +

                    '    layoutParamsTextSEffectVolume.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsTextSEffectVolume.setMargins(leftDpRightTexts, topDpSeekBarSEffectVolume, 0, 0)' + '\n\n' +

                    '    textViewSEffectVolume.layoutParams = layoutParamsTextSEffectVolume' + '\n' +
                    '    textViewSEffectVolume.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewSEffectVolume)' + '\n\n' +

                    '    val seekBarSEffectVolume = SeekBar(this)' + '\n' +
                    '    seekBarSEffectVolume.max = 100' + '\n' +
                    '    seekBarSEffectVolume.progress = (sEffectVolume * 100).toInt()' + '\n\n' +

                    '    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarSEffectVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarSEffectVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSEffectVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSEffectVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarSEffectVolume.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBarSEffectVolume = FrameLayout.LayoutParams(' + '\n' +
                    '      500,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpTextSEffectVolume: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 150f, resourceDisplayMetrics).toInt()' + '\n\n' +

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
                    '          editor.apply()' + '\n\n' +
                    '        }' + '\n' +
                    '      }' + '\n\n' +

                    '      override fun onStartTrackingTouch(seekBar: SeekBar?) {}' + '\n\n' +

                    '      override fun onStopTrackingTouch(seekBar: SeekBar?) {}' + '\n' +
                    '    })' + '\n\n' +

                    '    val textViewSceneMusic = TextView(this)' + '\n' +
                    '    textViewSceneMusic.text = "Scene music: " + (sceneMusicVolume * 100).toInt().toString() + "%"' + '\n' +
                    '    textViewSceneMusic.textSize = 15f' + '\n' +
                    '    textViewSceneMusic.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsTextSceneMusic = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpSeekBarSceneMusic: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 176f, resourceDisplayMetrics).toInt()' + '\n\n' +

                    '    layoutParamsTextSceneMusic.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsTextSceneMusic.setMargins(leftDpRightTexts, topDpSeekBarSceneMusic, 0, 0)' + '\n\n' +

                    '    textViewSceneMusic.layoutParams = layoutParamsTextSceneMusic' + '\n' +
                    '    textViewSceneMusic.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textViewSceneMusic)' + '\n\n' +

                    '    val seekBarSceneMusic = SeekBar(this)' + '\n' +
                    '    seekBarSceneMusic.max = 100' + '\n' +
                    '    seekBarSceneMusic.progress = (sceneMusicVolume * 100).toInt()' + '\n\n' +

                    '    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {' + '\n' +
                    '      seekBarSceneMusic.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)' + '\n' +
                    '      seekBarSceneMusic.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)' + '\n' +
                    '    } else {' + '\n' +
                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSceneMusic.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)' + '\n\n' +

                    '      @Suppress("DEPRECATION")' + '\n' +
                    '      seekBarSceneMusic.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)' + '\n' +
                    '    }' + '\n\n' +

                    '    seekBarSceneMusic.thumbOffset = 0' + '\n\n' +

                    '    val layoutParamsSeekBarSceneMusic = FrameLayout.LayoutParams(' + '\n' +
                    '      500,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    val topDpTextSceneMusic: Int = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 200f, resourceDisplayMetrics).toInt()' + '\n\n' +

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
             '      <solid android:color="#' + options.seekBar.backgroundColor + '" />' + '\n' +
             '      <size android:height="14dp" />' + '\n' +
             '    </shape>' + '\n' +
             '  </item>' + '\n' +
             '  <item android:id="@android:id/progress">' + '\n' +
             '    <clip>' + '\n' +
             '      <shape android:shape="rectangle">' + '\n' +
             '        <solid android:color="#' + options.seekBar.progressColor + '" />' + '\n' +
             '        <size android:height="14dp" />' + '\n' +
             '      </shape>' + '\n' +
             '    </clip>' + '\n' +
             '  </item>' + '\n' +
             '</layer-list>'
  })

  visualNovel.customXML.push({
    path: 'drawable/custom_seekbar_thumb.xml',
    content: '<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">' + '\n' +
             '  <solid android:color="#' + options.seekBar.thumbColor + '" />' + '\n' +
             '  <size android:width="7dp" android:height="14dp" />' + '\n' +
             '</shape>'
  })
  
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