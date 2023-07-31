package com.perforvnm

import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.media.MediaPlayer
import android.widget.TextView
import android.widget.ImageView
import android.widget.FrameLayout
import android.widget.Button
import android.widget.SeekBar
import android.view.View
import android.view.Gravity
import android.view.LayoutInflater
import android.view.ViewGroup.LayoutParams
import android.view.animation.Animation
import android.view.animation.LinearInterpolator
import android.view.animation.AlphaAnimation
import android.view.WindowManager
import android.graphics.PorterDuff
import android.graphics.Paint
import android.graphics.Canvas
import android.content.Context
import android.content.SharedPreferences
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent

class MainActivity : ComponentActivity() {
  private val handler = Handler(Looper.getMainLooper())
  private var textSpeed = 1000L
  private var effectVolume = 1f
  private var mediaPlayer: MediaPlayer? = null

  override fun onPause() {
    super.onPause()

    mediaPlayer?.pause()
  }

  override fun onResume() {
    super.onResume()

    if (mediaPlayer != null) {
      mediaPlayer!!.seekTo(mediaPlayer!!.getCurrentPosition())
      mediaPlayer!!.start()
    }
  }

  override fun onDestroy() {
    super.onDestroy()

    handler.removeCallbacksAndMessages(null)

    if (mediaPlayer != null) {
      mediaPlayer!!.stop()
      mediaPlayer!!.release()
      mediaPlayer = null
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
      window.attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.setDecorFitsSystemWindows(false)
    } else {
      @Suppress("DEPRECATION")
      window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
    }

    setContent {
      val sharedPreferences = getSharedPreferences("VNConfig", Context.MODE_PRIVATE)
      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = sharedPreferences.getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      textSpeed = sharedPreferences.getLong("textSpeed", 50L)

      menu()
    }
  }

  private fun menu() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.raw.menu)
    imageView.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView)

    val rectangleView = RectangleView(this)

    val layoutParams = FrameLayout.LayoutParams(1920, 100)
    layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParams
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 15f
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(300, 0, 50, -10)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1()
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.textSize = 15f
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(550, 0, 0, -10)

    buttonAbout.layoutParams = layoutParamsAbout

    buttonAbout.setOnClickListener {
      about(true)
    }

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.textSize = 15f
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(800, 0, 0, -10)

    buttonSettings.layoutParams = layoutParamsSettings

    buttonSettings.setOnClickListener {
      settings(true)
    }

    frameLayout.addView(buttonSettings)

    setContentView(frameLayout)
  }

  private fun about(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.raw.menu)
    imageView.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView)

    val rectangleGrayView = RectangleView(this)

    val layoutParamsGrayRectangle = FrameLayout.LayoutParams(1920, 1080)
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

    val layoutParamsRectangle = FrameLayout.LayoutParams(1920, 100)
    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParamsRectangle
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 15f
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(300, 0, 0, -10)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1()
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.textSize = 15f
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(550, 0, 0, -10)

    buttonAbout.layoutParams = layoutParamsAbout

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.textSize = 15f
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(800, 0, 0, -10)

    buttonSettings.layoutParams = layoutParamsSettings

    buttonSettings.setOnClickListener {
      settings(false)
    }

    frameLayout.addView(buttonSettings)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.textSize = 20f
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(250, 0, 0, 0)

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
    textView.text = "The PerforVNM 1.0.0\n\nMade with"
    textView.textSize = 15f
    textView.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(300, 200, 0, 0)

    textView.layoutParams = layoutParamsText
    textView.startAnimation(animationTexts)

    frameLayout.addView(textView)

    val textView2 = TextView(this)
    textView2.text = "PerforVNM"
    textView2.textSize = 15f
    textView2.setTextColor(0xFF0000EE.toInt())

    val layoutParamsText2 = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText2.gravity = Gravity.TOP or Gravity.START
    layoutParamsText2.setMargins(510, 303, 0, 0)

    textView2.layoutParams = layoutParamsText2
    textView2.startAnimation(animationTexts)

    textView2.setOnClickListener {
      startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("https://github.com/PerformanC/PerforVNMaker")))
    }

    frameLayout.addView(textView2)

    val textView3 = TextView(this)
    textView3.text = "1.5.4-beta"
    textView3.textSize = 15f
    textView3.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText3 = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText3.gravity = Gravity.TOP or Gravity.START
    layoutParamsText3.setMargins(740, 303, 0, 0)

    textView3.layoutParams = layoutParamsText3
    textView3.startAnimation(animationTexts)

    frameLayout.addView(textView3)

    val textView4 = TextView(this)
    textView4.text = "This program is licensed under the PerformanC License, and its (PerforVNM) content is totally\n open source."
    textView4.textSize = 15f
    textView4.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText4 = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText4.gravity = Gravity.TOP or Gravity.START
    layoutParamsText4.setMargins(300, 400, 0, 0)

    textView4.layoutParams = layoutParamsText4
    textView4.startAnimation(animationTexts)

    frameLayout.addView(textView4)

    setContentView(frameLayout)
  }

  private fun settings(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.raw.menu)
    imageView.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView)

    val rectangleGrayView = RectangleView(this)

    val layoutParamsGrayRectangle = FrameLayout.LayoutParams(1920, 1080)
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

    val layoutParamsRectangle = FrameLayout.LayoutParams(1920, 100)
    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParamsRectangle
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 15f
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(300, 0, 0, -10)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1()
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.textSize = 15f
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(550, 0, 0, -10)

    buttonAbout.layoutParams = layoutParamsAbout

    buttonAbout.setOnClickListener {
      about(false)
    }

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.textSize = 15f
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(800, 0, 0, -10)

    buttonSettings.layoutParams = layoutParamsSettings

    frameLayout.addView(buttonSettings)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.textSize = 20f
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(250, 0, 0, 0)

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
    textViewTextSpeed.textSize = 15f
    textViewTextSpeed.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(500, 200, 0, 0)

    textViewTextSpeed.layoutParams = layoutParamsText
    textViewTextSpeed.startAnimation(animationTexts)

    frameLayout.addView(textViewTextSpeed)

    val seekBarTextSpeed = SeekBar(this)
    seekBarTextSpeed.max = 100
    seekBarTextSpeed.progress = textSpeed.toInt()

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
      seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)
      seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)
    } else {
      @Suppress("DEPRECATION")
      seekBarTextSpeed.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)

      @Suppress("DEPRECATION")
      seekBarTextSpeed.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)
    }

    seekBarTextSpeed.thumbOffset = 0

    val layoutParamsSeekBar = FrameLayout.LayoutParams(
      500,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSeekBar.gravity = Gravity.TOP or Gravity.START
    layoutParamsSeekBar.setMargins(460, 260, 0, 0)

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
    textViewMusicVolume.text = "Music volume: " + (musicVolume * 100).toInt().toString() + "%"
    textViewMusicVolume.textSize = 15f
    textViewMusicVolume.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextMusicVolume = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.END
    layoutParamsTextMusicVolume.setMargins(0, 200, 380, 0)

    textViewMusicVolume.layoutParams = layoutParamsTextMusicVolume
    textViewMusicVolume.startAnimation(animationTexts)

    frameLayout.addView(textViewMusicVolume)

    val seekBarMusicVolume = SeekBar(this)
    seekBarMusicVolume.max = 100
    seekBarMusicVolume.progress = (musicVolume * 100).toInt()

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
      seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress, null)
      seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb, null)
    } else {
      @Suppress("DEPRECATION")
      seekBarMusicVolume.progressDrawable = resources.getDrawable(R.drawable.custom_seekbar_progress)

      @Suppress("DEPRECATION")
      seekBarMusicVolume.thumb = resources.getDrawable(R.drawable.custom_seekbar_thumb)
    }

    seekBarMusicVolume.thumbOffset = 0

    val layoutParamsSeekBarMusicVolume = FrameLayout.LayoutParams(
      500,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSeekBarMusicVolume.gravity = Gravity.TOP or Gravity.END
    layoutParamsSeekBarMusicVolume.setMargins(0, 260, 260, 0)

    seekBarMusicVolume.layoutParams = layoutParamsSeekBarMusicVolume

    seekBarMusicVolume.startAnimation(animationTexts)

    frameLayout.addView(seekBarMusicVolume)

    seekBarMusicVolume.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
      override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
        if (fromUser) {
          textViewMusicVolume.text = "Music volume: " + progress.toString() + "%"

          editor.putFloat("musicVolume", progress.toFloat() / 100)
          editor.apply()

          mediaPlayer?.setVolume(progress.toFloat() / 100, progress.toFloat() / 100)
        }
      }

      override fun onStartTrackingTouch(seekBar: SeekBar?) {}

      override fun onStopTrackingTouch(seekBar: SeekBar?) {}
    })

    setContentView(frameLayout)
  }

  private fun scene1() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_Pedro)

    mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

    handler.postDelayed(object : Runnable {
      override fun run() {
        mediaPlayer?.start()

        mediaPlayer?.setVolume(effectVolume, effectVolume)
        mediaPlayer?.setOnCompletionListener {
          mediaPlayer?.stop()
          mediaPlayer?.release()
          mediaPlayer = null
        }
      }
    }, 1000L)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.textSize = 10f
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(50, 0, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        val volume = getSharedPreferences("PerforVNM", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    setContentView(frameLayout)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene2(true)
    }
  }

  private fun scene2(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.START or Gravity.CENTER_VERTICAL
    layoutParams_Pedro.setMargins(200, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val layoutParamsRectangleSpeech = FrameLayout.LayoutParams(1920, 200)
    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech
    rectangleViewSpeech.setColor(0xFF000000.toInt())

    if (animate) {
      val animationRectangleSpeech = AlphaAnimation(0f, 0.8f)
      animationRectangleSpeech.duration = 1000
      animationRectangleSpeech.interpolator = LinearInterpolator()
      animationRectangleSpeech.fillAfter = true

      rectangleViewSpeech.startAnimation(animationRectangleSpeech)
    } else {
      rectangleViewSpeech.setAlpha(0.8f)
    }

    frameLayout.addView(rectangleViewSpeech)

    val textViewSpeech = TextView(this)
    textViewSpeech.textSize = 12f
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, 0, 0, 80)

    textViewSpeech.layoutParams = layoutParamsSpeech

    var speechText = "\"Welcome, user. Thanks for testing our code generator, this is an *basic*\n example of usage of the PerforVNM.\""

    if (animate) {
      var i = 0

      handler.postDelayed(object : Runnable {
        override fun run() {
          if (i < speechText.length) {
            textViewSpeech.text = speechText.substring(0, i + 1)
            i++
            handler.postDelayed(this, textSpeed)
          }
        }
      }, textSpeed)
    } else {
      textViewSpeech.text = speechText
    }

    frameLayout.addView(textViewSpeech)

    val rectangleViewAuthor = RectangleView(this)

    val layoutParamsRectangleAuthor = FrameLayout.LayoutParams(1920, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, 200)

    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor
    rectangleViewAuthor.setColor(0xFF000000.toInt())

    if (animate) {
      val animationRectangleAuthor = AlphaAnimation(0f, 0.6f)
      animationRectangleAuthor.duration = 1000
      animationRectangleAuthor.interpolator = LinearInterpolator()
      animationRectangleAuthor.fillAfter = true

      rectangleViewAuthor.startAnimation(animationRectangleAuthor)
    } else { 
      rectangleViewAuthor.setAlpha(0.6f)
    }

    frameLayout.addView(rectangleViewAuthor)

    val textViewAuthor = TextView(this)
    textViewAuthor.text = "Pedro"
    textViewAuthor.textSize = 20f
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(400, 0, 0, 200)

    textViewAuthor.layoutParams = layoutParamsAuthor

    if (animate) {
      val animationAuthor = AlphaAnimation(0f, 1f)
      animationAuthor.duration = 1000
      animationAuthor.interpolator = LinearInterpolator()
      animationAuthor.fillAfter = true

      textViewAuthor.startAnimation(animationAuthor)
    }
    frameLayout.addView(textViewAuthor)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.textSize = 10f
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(50, 0, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.textSize = 10f
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(50, 80, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      scene1()
    }

    frameLayout.addView(buttonBack)

    setContentView(frameLayout)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      scene3()

      it.setOnClickListener(null)
    }
  }

  private fun scene3() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.START or Gravity.CENTER_VERTICAL
    layoutParams_Pedro.setMargins(200, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val layoutParamsRectangleSpeech = FrameLayout.LayoutParams(1920, 200)
    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech
    rectangleViewSpeech.setAlpha(0.8f)
    rectangleViewSpeech.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewSpeech)

    val textViewSpeech = TextView(this)
    textViewSpeech.textSize = 12f
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, 0, 0, 80)

    textViewSpeech.layoutParams = layoutParamsSpeech

    var speechText = "\"And this is the third scene, incredible right? With this code generator\n you can make your own visual novels in a simple way.\""
    var i = 0

    handler.postDelayed(object : Runnable {
      override fun run() {
        if (i < speechText.length) {
          textViewSpeech.text = speechText.substring(0, i + 1)
          i++
          handler.postDelayed(this, textSpeed)
        }
      }
    }, textSpeed)

    frameLayout.addView(textViewSpeech)

    val rectangleViewAuthor = RectangleView(this)

    val layoutParamsRectangleAuthor = FrameLayout.LayoutParams(1920, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, 200)

    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor
    rectangleViewAuthor.setAlpha(0.6f)
    rectangleViewAuthor.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewAuthor)

    val textViewAuthor = TextView(this)
    textViewAuthor.text = "Pedro"
    textViewAuthor.textSize = 20f
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(400, 0, 0, 200)

    textViewAuthor.layoutParams = layoutParamsAuthor


    frameLayout.addView(textViewAuthor)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.textSize = 10f
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(50, 0, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.textSize = 10f
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(50, 80, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      scene2(false)
    }

    frameLayout.addView(buttonBack)

    setContentView(frameLayout)
  }
}

class RectangleView(context: Context) : View(context) {
  private val paint = Paint().apply {
    color = 0xFF000000.toInt()
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
}
