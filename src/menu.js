import fs from 'fs'

import helper from './helper.js'

function make(options) {
  if (!options?.background?.image) {
    console.error('ERROR: Menu background image not provided.')

    process.exit(1)
  }

  if (options.background.music) {
    if (!fs.readdirSync(`../android/app/src/main/res/raw`).find((file) => file.startsWith(options.background.music))) {
      console.error(`ERROR: Menu background music not found.`)
  
      process.exit(1)
    }

    if (visualNovel.scenes.find((scene) => scene.speech)) {
      visualNovel.code = visualNovel.code.replace('__PERFORVNM_ONDESTROY__', 'if (mediaPlayer != null) {\n      mediaPlayer!!.stop()\n      mediaPlayer!!.release()\n      mediaPlayer = null\n    }')

      visualNovel.code = visualNovel.code.replace('__PERFORVNM_HEADER__', '__PERFORVNM_HEADER__\n  private var mediaPlayer: MediaPlayer? = null\n\n  override fun onPause() {\n    super.onPause()\n    mediaPlayer?.pause()\n  }\n\n  override fun onResume() {\n    super.onResume()\n    if (mediaPlayer != null) {\n      mediaPlayer!!.seekTo(mediaPlayer!!.getCurrentPosition())\n      mediaPlayer!!.start()\n    }\n  }\n')
    } else
      visualNovel.code = visualNovel.code.replace('__PERFORVNM_HEADER__', '__PERFORVNM_HEADER__\n  private var mediaPlayer: MediaPlayer? = null\n\n  override fun onPause() {\n    super.onPause()\n    mediaPlayer?.pause()\n  }\n\n  override fun onResume() {\n    super.onResume()\n    if (mediaPlayer != null) {\n      mediaPlayer!!.seekTo(mediaPlayer!!.getCurrentPosition())\n      mediaPlayer!!.start()\n    }\n  }\n\n  override fun onDestroy() {\n    super.onDestroy()__PERFORVNM_ONDESTROY__\n    if (mediaPlayer != null) {\n      mediaPlayer!!.stop()\n      mediaPlayer!!.release()\n      mediaPlayer = null\n    }\n  }\n')
  }

  if (!fs.readdirSync(`../android/app/src/main/res/drawable`).find((file) => file.startsWith(options.background.image))) {
    console.error('ERROR: Menu background image not found.')

    process.exit(1)
  }

  if (!options.textColor) {
    console.error('ERROR: Menu text color not provided.')

    process.exit(1)
  }

  if (!options.backTextColor) {
    console.error('ERROR: Menu "back" text color not provided.')

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

  const menuCode = '  private fun menu() {' + '\n' +
                   '    val frameLayout = FrameLayout(this)' + '\n' +
                   '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                   '    val imageView = ImageView(this)' + '\n' +
                   '    imageView.setImageResource(R.drawable.' + options.background.image + ')' + '\n' +
                   '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   '    frameLayout.addView(imageView)' + '\n\n' +

                   '    val rectangleView = RectangleView(this)' + '\n\n' +

                   '    val layoutParams = FrameLayout.LayoutParams(1920, 100)' + '\n' +
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

                   '    buttonStart.setOnClickListener {' + '\n' +
                   (options.background.music ? '      mediaPlayer?.stop()' + '\n\n' : '') +
                   '      ' + (visualNovel.scenes[0] ? visualNovel.scenes[0].name + '()' : '__PERFORVNM_FIRST_SCENE__') + '\n' +
                   '    }' + '\n\n' +

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
                   '      about()' + '\n' +
                   '    }' + '\n\n' +

                   '    frameLayout.addView(buttonAbout)' + '\n\n' +

                   '    setContentView(frameLayout)' + '\n' +
                    '  }'

  helper.writeScene(menuCode)

  if (options.background.music) visualNovel.code = visualNovel.code.replace(/__PERFORVNM_MENU__/g, 'mediaPlayer = MediaPlayer.create(this, R.raw.' + options.background.music + ')' + '\n' +
                                                                                           '        mediaPlayer?.start()' + '\n\n' +

                                                                                           '        mediaPlayer?.setOnCompletionListener {' + '\n' +
                                                                                           '          mediaPlayer?.start()' + '\n' +
                                                                                           '        }' + '\n\n' +

                                                                                           '        menu()')
  else visualNovel.code = visualNovel.code.replace(/__PERFORVNM_MENU__/g, 'menu()')

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

  visualNovel.code = visualNovel.code.replace('__PERFORVNM_CLASSES__', rectangleViewCode)

  const sceneCode = '  private fun about() {' + '\n' +
                    '    val frameLayout = FrameLayout(this)' + '\n' +
                    '    frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                    '    val imageView = ImageView(this)' + '\n' +
                    '    imageView.setImageResource(R.drawable.' + options.background.image + ')' + '\n' +
                    '    imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                    '    frameLayout.addView(imageView)' + '\n\n' +

                    '    val animationImageView = AlphaAnimation(0f, 0.5f)' + '\n' +
                    '    animationImageView.duration = 500'  + '\n' +
                    '    animationImageView.interpolator = LinearInterpolator()' + '\n' +
                    '    animationImageView.fillAfter = true' + '\n\n' +
                
                    '    imageView.startAnimation(animationImageView)' + '\n' +

                    '    val rectangleView = RectangleView(this)' + '\n\n' +

                    '    val layoutParamsRectangle = FrameLayout.LayoutParams(1920, 100)' + '\n' +
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

                    '    buttonStart.setOnClickListener {' + '\n' +
                    (options.background.music ? '      if (mediaPlayer) {' + '\n' +
                    '        mediaPlayer!!.stop()' + '\n' + 
                    '        mediaPlayer!!.release()' +
                    '        mediaPlayer = null' +
                    '      }' + '\n\n' : '') +
                    '      ' + (visualNovel.scenes[0] ? visualNovel.scenes[0].name + '()' : '__PERFORVNM_FIRST_SCENE__') + '\n' +
                    '    }' + '\n\n' +

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
                    '    textView.text = "' + visualNovel.info.fullName + ' ' + visualNovel.info.version + '\\n\\nMade with"' + '\n' +
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

                    '    frameLayout.addView(textView)' + '\n\n' +

                    '    val textView2 = TextView(this)' + '\n' +
                    '    textView2.text = "PerforVNM"' + '\n' +
                    '    textView2.textSize = 15f' + '\n' +
                    '    textView2.setTextColor(0xFF0000EE.toInt())' + '\n\n' +

                    '    val layoutParamsText2 = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsText2.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsText2.setMargins(510, 303, 0, 0)' + '\n\n' +

                    '    textView2.layoutParams = layoutParamsText2' + '\n' +
                    '    textView2.startAnimation(animationTexts)' + '\n\n' +

                    '    textView2.setOnClickListener {' + '\n' +
                    '      startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("' + PerforVNM.repository + '")))' + '\n' +
                    '    }' + '\n\n' +

                    '    frameLayout.addView(textView2)' + '\n\n' +

                    '    val textView3 = TextView(this)' + '\n' +
                    '    textView3.text = "' + PerforVNM.version + '"' + '\n' +
                    '    textView3.textSize = 15f' + '\n' +
                    '    textView3.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsText3 = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsText3.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsText3.setMargins(740, 303, 0, 0)' + '\n\n' +

                    '    textView3.layoutParams = layoutParamsText3' + '\n' +
                    '    textView3.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textView3)' + '\n\n' +

                    '    val textView4 = TextView(this)' + '\n' +
                    '    textView4.text = "This program is licensed under the PerformanC License, and its (PerforVNM) content is totally\\n open source."' + '\n' +
                    '    textView4.textSize = 15f' + '\n' +
                    '    textView4.setTextColor(0xFF' + options.textColor + '.toInt())' + '\n\n' +

                    '    val layoutParamsText4 = FrameLayout.LayoutParams(' + '\n' +
                    '      LayoutParams.WRAP_CONTENT,' + '\n' +
                    '      LayoutParams.WRAP_CONTENT' + '\n' +
                    '    )' + '\n\n' +

                    '    layoutParamsText4.gravity = Gravity.TOP or Gravity.START' + '\n' +
                    '    layoutParamsText4.setMargins(300, 400, 0, 0)' + '\n\n' +

                    '    textView4.layoutParams = layoutParamsText4' + '\n' +
                    '    textView4.startAnimation(animationTexts)' + '\n\n' +

                    '    frameLayout.addView(textView4)' + '\n\n' +

                    '    setContentView(frameLayout)' + '\n' +
                    '  }'

  helper.writeScene(sceneCode)

  visualNovel.menu = {
    name: 'menu()',
    backgroundMusic: true
  }

  console.log('Menu coded. (Android)')
}

export default {
  make
}