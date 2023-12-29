package com.perforvnm

import java.io.File
import java.io.InputStreamReader
import org.json.JSONArray

import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.app.Activity
import android.util.TypedValue
import android.media.MediaPlayer
import android.widget.Toast
import android.widget.TextView
import android.widget.ImageView
import android.widget.ScrollView
import android.widget.FrameLayout
import android.widget.FrameLayout.LayoutParams
import android.widget.Button
import android.widget.SeekBar
import android.view.View
import android.view.Gravity
import android.view.animation.Animation
import android.view.animation.LinearInterpolator
import android.view.animation.OvershootInterpolator
import android.view.animation.AlphaAnimation
import android.animation.Animator
import android.text.TextUtils
import android.text.SpannableStringBuilder
import android.text.style.ClickableSpan
import android.text.method.LinkMovementMethod
import android.graphics.Paint
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.content.Context
import android.content.SharedPreferences

class MainActivity : Activity() {
  private var scenes = MutableList<Int>(6) { 0 }
  private var scenesLength = 1
  private var items = MutableList<Int>(1) { 0 }
  private var itemsLength = 0
  private val handler = Handler(Looper.getMainLooper())
  private var textSpeed = 50L
  private var sEffectVolume = 1f
  private var sceneMusicVolume = 1f
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

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.setDecorFitsSystemWindows(false)
    } else {
      @Suppress("DEPRECATION")
      window.decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        or View.SYSTEM_UI_FLAG_FULLSCREEN
        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        or View.SYSTEM_UI_FLAG_LOW_PROFILE
      )
    }

    scenes.set(0, 1722916382)

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

    sEffectVolume = sharedPreferences.getFloat("sEffectVolume", 1f)

    val savesFile = File(getFilesDir(), "saves.json")
    if (!savesFile.exists()) {
      savesFile.createNewFile()
      savesFile.writeText("[]")
    }

    val achievementsFile = File(getFilesDir(), "achievements.json")
    if (!achievementsFile.exists()) {
      achievementsFile.createNewFile()
      achievementsFile.writeText("[]")
    }

    menu()
  }

  private fun menu() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.raw.menu)
    imageView.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView)

    val rectangleView = RectangleView(this)

    val layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._30sdp))
    layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParams
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val ssp13 = resources.getDimension(com.intuit.ssp.R.dimen._13ssp)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdpminus3 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, sdpminus3)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1(true)
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, sdpminus3)

    buttonAbout.layoutParams = layoutParamsAbout

    buttonAbout.setOnClickListener {
      about(true)
    }

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, sdpminus3)

    buttonSettings.layoutParams = layoutParamsSettings

    buttonSettings.setOnClickListener {
      settings(true)
    }

    frameLayout.addView(buttonSettings)

    val buttonSaves = Button(this)
    buttonSaves.text = "Saves"
    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
    buttonSaves.background = null

    val layoutParamsSaves = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, sdpminus3)

    buttonSaves.layoutParams = layoutParamsSaves

    buttonSaves.setOnClickListener {
      saves(true)
    }

    frameLayout.addView(buttonSaves)

    val buttonAchievements = Button(this)
    buttonAchievements.text = "Achievements"
    buttonAchievements.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAchievements.setTextColor(0xFFFFFFFFF.toInt())
    buttonAchievements.background = null

    val layoutParamsAchievements = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAchievements.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAchievements.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._390sdp), 0, 0, sdpminus3)

    buttonAchievements.layoutParams = layoutParamsAchievements

    buttonAchievements.setOnClickListener {
      achievements(true)
    }

    frameLayout.addView(buttonAchievements)

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
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val ssp13 = resources.getDimension(com.intuit.ssp.R.dimen._13ssp)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp88 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp)
    val sdpminus3 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(sdp88, 0, 0, sdpminus3)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1(true)
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, sdpminus3)

    buttonAbout.layoutParams = layoutParamsAbout

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, sdpminus3)

    buttonSettings.layoutParams = layoutParamsSettings

    buttonSettings.setOnClickListener {
      settings(false)
    }

    frameLayout.addView(buttonSettings)

    val buttonSaves = Button(this)
    buttonSaves.text = "Saves"
    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
    buttonSaves.background = null

    val layoutParamsSaves = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, sdpminus3)

    buttonSaves.layoutParams = layoutParamsSaves

    buttonSaves.setOnClickListener {
      saves(false)
    }

    frameLayout.addView(buttonSaves)

    val buttonAchievements = Button(this)
    buttonAchievements.text = "Achievements"
    buttonAchievements.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAchievements.setTextColor(0xFFFFFFFFF.toInt())
    buttonAchievements.background = null

    val layoutParamsAchievements = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAchievements.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAchievements.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._390sdp), 0, 0, sdpminus3)

    buttonAchievements.layoutParams = layoutParamsAchievements

    buttonAchievements.setOnClickListener {
      achievements(false)
    }

    frameLayout.addView(buttonAchievements)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      menu()
    }

    val animationTexts = AlphaAnimation(0f, 1f)
    animationTexts.duration = 500
    animationTexts.interpolator = LinearInterpolator()
    animationTexts.fillAfter = true

    buttonBack.startAnimation(animationTexts)

    frameLayout.addView(buttonBack)

    val textView = TextView(this)
    textView.text = SpannableStringBuilder().apply {
      append("The PerforVNM 1.0.0\n\nMade with ")
      append("PerforVNM")
      setSpan(object : ClickableSpan() {
        override fun onClick(widget: View) {
          startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("https://github.com/PerformanC/PerforVNMaker")))
        }
      }, length - "PerforVNM".length, length, 0)
      append(" 2.0.0 (code generator), 1.21.0 (generated code).\n\nThis is our example visual novel, made by @ThePedroo")
    }
    textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._11ssp))
    textView.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(sdp88, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp), 0, 0)

    textView.layoutParams = layoutParamsText
    textView.startAnimation(animationTexts)

    textView.ellipsize = TextUtils.TruncateAt.END
    textView.movementMethod = LinkMovementMethod.getInstance()

    frameLayout.addView(textView)

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
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val ssp13 = resources.getDimension(com.intuit.ssp.R.dimen._13ssp)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdpminus3 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, sdpminus3)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1(true)
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, sdpminus3)

    buttonAbout.layoutParams = layoutParamsAbout

    buttonAbout.setOnClickListener {
      about(false)
    }

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, sdpminus3)

    buttonSettings.layoutParams = layoutParamsSettings

    frameLayout.addView(buttonSettings)

    val buttonSaves = Button(this)
    buttonSaves.text = "Saves"
    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
    buttonSaves.background = null

    val layoutParamsSaves = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, sdpminus3)

    buttonSaves.layoutParams = layoutParamsSaves

    buttonSaves.setOnClickListener {
      saves(false)
    }

    frameLayout.addView(buttonSaves)

    val buttonAchievements = Button(this)
    buttonAchievements.text = "Achievements"
    buttonAchievements.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAchievements.setTextColor(0xFFFFFFFFF.toInt())
    buttonAchievements.background = null

    val layoutParamsAchievements = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAchievements.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAchievements.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._390sdp), 0, 0, sdpminus3)

    buttonAchievements.layoutParams = layoutParamsAchievements

    buttonAchievements.setOnClickListener {
      achievements(false)
    }

    frameLayout.addView(buttonAchievements)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      menu()
    }

    val animationTexts = AlphaAnimation(0f, 1f)
    animationTexts.duration = 500
    animationTexts.interpolator = LinearInterpolator()
    animationTexts.fillAfter = true

    buttonBack.startAnimation(animationTexts)

    frameLayout.addView(buttonBack)

    val ssp16 = resources.getDimension(com.intuit.ssp.R.dimen._16ssp)

    val textViewTextSpeed = TextView(this)
    textViewTextSpeed.text = "Text speed: " + textSpeed.toString() + "ms"
    textViewTextSpeed.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp16)
    textViewTextSpeed.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp53 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._149sdp), sdp53, 0, 0)

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

    val sdp150 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp)

    val layoutParamsSeekBar = LayoutParams(
      sdp150,
      LayoutParams.WRAP_CONTENT
    )

    val sdp135 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._135sdp)
    val sdp77 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._77sdp)

    layoutParamsSeekBar.gravity = Gravity.TOP or Gravity.START
    layoutParamsSeekBar.setMargins(sdp135, sdp77, 0, 0)

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
    textViewMusicVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp16)
    textViewMusicVolume.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextMusicVolume = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp443 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._443sdp)

    layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.START
    layoutParamsTextMusicVolume.setMargins(sdp443, sdp53, 0, 0)

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
      sdp150,
      LayoutParams.WRAP_CONTENT
    )

    val sdp432 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._432sdp)

    layoutParamsSeekBarMusicVolume.gravity = Gravity.TOP or Gravity.START
    layoutParamsSeekBarMusicVolume.setMargins(sdp432, sdp77, 0, 0)

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
    textViewSEffectVolume.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp16)
    textViewSEffectVolume.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextSEffectVolume = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsTextSEffectVolume.gravity = Gravity.TOP or Gravity.START
    layoutParamsTextSEffectVolume.setMargins(sdp443, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._111sdp), 0, 0)

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
      sdp150,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSeekBarSEffectVolume.gravity = Gravity.TOP or Gravity.START
    layoutParamsSeekBarSEffectVolume.setMargins(sdp432, sdp135, 0, 0)

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
    textViewSceneMusic.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp16)
    textViewSceneMusic.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextSceneMusic = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsTextSceneMusic.gravity = Gravity.TOP or Gravity.START
    layoutParamsTextSceneMusic.setMargins(sdp443, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._166sdp), 0, 0)

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
      sdp150,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSeekBarSceneMusic.gravity = Gravity.TOP or Gravity.START
    layoutParamsSeekBarSceneMusic.setMargins(sdp432, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._190sdp), 0, 0)

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
    })

    setContentView(frameLayout)
  }

  private fun saves(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.raw.menu)
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
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val ssp13 = resources.getDimension(com.intuit.ssp.R.dimen._13ssp)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdpminus3 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, sdpminus3)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1(true)
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, sdpminus3)

    buttonAbout.layoutParams = layoutParamsAbout

    buttonAbout.setOnClickListener {
      about(false)
    }

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, sdpminus3)

    buttonSettings.layoutParams = layoutParamsSettings

    buttonSettings.setOnClickListener {
      settings(false)
    }

    frameLayout.addView(buttonSettings)

    val buttonSaves = Button(this)
    buttonSaves.text = "Saves"
    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
    buttonSaves.background = null

    val layoutParamsSaves = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, sdpminus3)

    buttonSaves.layoutParams = layoutParamsSaves

    frameLayout.addView(buttonSaves)

    val buttonAchievements = Button(this)
    buttonAchievements.text = "Achievements"
    buttonAchievements.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAchievements.setTextColor(0xFFFFFFFFF.toInt())
    buttonAchievements.background = null

    val layoutParamsAchievements = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAchievements.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAchievements.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._390sdp), 0, 0, sdpminus3)

    buttonAchievements.layoutParams = layoutParamsAchievements

    buttonAchievements.setOnClickListener {
      achievements(false)
    }

    frameLayout.addView(buttonAchievements)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      menu()
    }

    val animationTexts = AlphaAnimation(0f, 1f)
    animationTexts.duration = 500
    animationTexts.interpolator = LinearInterpolator()
    animationTexts.fillAfter = true

    buttonBack.startAnimation(animationTexts)

    frameLayout.addView(buttonBack)

    val scrollView = ScrollView(this)

    val layoutParamsScroll = LayoutParams(
      LayoutParams.MATCH_PARENT,
      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._287sdp)
    )

    layoutParamsScroll.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL

    scrollView.layoutParams = layoutParamsScroll

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

      val sdp100 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._100sdp)
      val sdp70 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._70sdp)

      val layoutParamsSavesBackground = LayoutParams(
        sdp100,
        sdp70
      )

      val leftDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_${leftDp}sdp", "dimen", getPackageName()))
      val topDpLoad = resources.getDimensionPixelSize(resources.getIdentifier("_${topDp}sdp", "dimen", getPackageName()))

      layoutParamsSavesBackground.gravity = Gravity.TOP or Gravity.START
      layoutParamsSavesBackground.setMargins(leftDpLoad, topDpLoad, 0, 0)

      savesBackground.layoutParams = layoutParamsSavesBackground

      savesBackground.setOnClickListener {
        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }

        val historyScenes = buttonData.getJSONArray("history")
        for (j in 0 until historyScenes.length()) {
          scenes.set(j, historyScenes.getInt(j))
        }
        scenesLength = historyScenes.length()

        val sceneItems = buttonData.getJSONArray("items")
        for (j in 0 until sceneItems.length()) {
          items.set(j, sceneItems.getInt(j))
        }
        itemsLength = sceneItems.length()
        
        switchScene(buttonData.getInt("scene"))
      }

      frameLayoutScenes.addView(savesBackground)

      val characters = buttonData.getJSONArray("characters")

      for (j in 0 until characters.length()) {
        val characterData = characters.getJSONObject(j)

        val imageViewCharacter = ImageView(this)

        val layoutParamsImageViewCharacter = LayoutParams(
          sdp100,
          sdp70
        )

        layoutParamsImageViewCharacter.gravity = Gravity.TOP or Gravity.START

        when (buttonData.getInt("scene")) {
          1722916382 -> {
            when (characterData.getString("name")) {
              "Pedro" -> {
                imageViewCharacter.setImageResource(R.raw.pedro_staring)

                layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad, 0, 0)
              }
            }
          }
          1722916385 -> {
            when (characterData.getString("name")) {
              "Pedro" -> {
                imageViewCharacter.setImageResource(R.raw.pedro_staring)

                val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._5sdp)

                layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
              }
            }
          }
          1722916386 -> {
            when (characterData.getString("name")) {
              "Pedro" -> {
                imageViewCharacter.setImageResource(R.raw.pedro_staring)

                val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._5sdp)

                layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
              }
            }
          }
          969329308 -> {
            when (characterData.getString("name")) {
              "Pedro" -> {
                imageViewCharacter.setImageResource(R.raw.pedro_staring)

                val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._5sdp)

                layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
              }
            }
          }
          1722916383 -> {
            when (characterData.getString("name")) {
              "Pedro" -> {
                imageViewCharacter.setImageResource(R.raw.pedro_staring)

                val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._5sdp)

                layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
              }
            }
          }
          1722916384 -> {
            when (characterData.getString("name")) {
              "Pedro" -> {
                imageViewCharacter.setImageResource(R.raw.pedro_staring)

                val leftDpCharacter = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._5sdp)

                layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
              }
            }
          }
        }

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

    frameLayout.addView(scrollView)

    setContentView(frameLayout)
  }

  private fun achievements(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.raw.menu)
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
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val ssp13 = resources.getDimension(com.intuit.ssp.R.dimen._13ssp)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdpminus3 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, sdpminus3)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      scene1(true)
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._161sdp), 0, 0, sdpminus3)

    buttonAbout.layoutParams = layoutParamsAbout

    buttonAbout.setOnClickListener {
      about(false)
    }

    frameLayout.addView(buttonAbout)

    val buttonSettings = Button(this)
    buttonSettings.text = "Settings"
    buttonSettings.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
    buttonSettings.background = null

    val layoutParamsSettings = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSettings.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSettings.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._233sdp), 0, 0, sdpminus3)

    buttonSettings.layoutParams = layoutParamsSettings

    buttonSettings.setOnClickListener {
      settings(false)
    }

    frameLayout.addView(buttonSettings)

    val buttonSaves = Button(this)
    buttonSaves.text = "Saves"
    buttonSaves.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
    buttonSaves.background = null

    val layoutParamsSaves = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSaves.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsSaves.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._320sdp), 0, 0, sdpminus3)

    buttonSaves.layoutParams = layoutParamsSaves

    buttonSaves.setOnClickListener {
      saves(false)
    }

    frameLayout.addView(buttonSaves)

    val buttonAchievements = Button(this)
    buttonAchievements.text = "Achievements"
    buttonAchievements.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp13)
    buttonAchievements.setTextColor(0xFFFFFFFFF.toInt())
    buttonAchievements.background = null

    val layoutParamsAchievements = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAchievements.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAchievements.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._390sdp), 0, 0, sdpminus3)

    buttonAchievements.layoutParams = layoutParamsAchievements

    frameLayout.addView(buttonAchievements)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._15ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._73sdp), 0, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      menu()
    }

    val animationTexts = AlphaAnimation(0f, 1f)
    animationTexts.duration = 500
    animationTexts.interpolator = LinearInterpolator()
    animationTexts.fillAfter = true

    buttonBack.startAnimation(animationTexts)

    frameLayout.addView(buttonBack)

    val scrollView = ScrollView(this)

    val layoutParamsScroll = LayoutParams(
      LayoutParams.MATCH_PARENT,
      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._300sdp)
    )

    layoutParamsScroll.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL

    scrollView.layoutParams = layoutParamsScroll

    val frameLayoutScenes = FrameLayout(this)

    val inputStream = openFileInput("achievements.json")
    val text = inputStream.bufferedReader().use { it.readText() }
    inputStream.close()

    val achievements = JSONArray(text)

    val ColorMatrixAchievements = ColorMatrix()
    ColorMatrixAchievements.setSaturation(0.0f)

    val achievement_first_achievement = ImageView(this)
    achievement_first_achievement.setImageResource(R.raw.achievement)

    val layoutParamsAchievement_first_achievement = LayoutParams(
      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._100sdp),
      resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._70sdp)
    )

    layoutParamsAchievement_first_achievement.gravity = Gravity.TOP or Gravity.START
    layoutParamsAchievement_first_achievement.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._120sdp), resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._50sdp), 0, 0)
    
    achievement_first_achievement.layoutParams = layoutParamsAchievement_first_achievement

    val ColorFilter_first_achievement = ColorMatrixColorFilter(ColorMatrixAchievements)
    achievement_first_achievement.setColorFilter(ColorFilter_first_achievement)
    achievement_first_achievement.setAlpha(0.7f)

    frameLayoutScenes.addView(achievement_first_achievement)

    for (i in 0 until achievements.length()) {
      when (achievements.getInt(i)) {
        1183596997 -> {
          achievement_first_achievement.setColorFilter(null)
          achievement_first_achievement.setAlpha(1.0f)
        }
      }
    }

    scrollView.addView(frameLayoutScenes)

    frameLayout.addView(scrollView)

    setContentView(frameLayout)
  }

  private fun scene1(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val animationFadeIn = AlphaAnimation(0f, 1f)
    animationFadeIn.duration = 1000
    animationFadeIn.interpolator = LinearInterpolator()
    animationFadeIn.fillAfter = true

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    if (animate) imageView_scenario.startAnimation(animationFadeIn)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    if (animate) {
      imageView_Pedro.startAnimation(animationFadeIn)

      animationFadeIn.setAnimationListener(object : Animation.AnimationListener {
        override fun onAnimationStart(animation: Animation?) {}

        override fun onAnimationEnd(animation: Animation?) {
          imageView_Pedro.animate()
            .translationY(-10f)
            .setDuration(500)
            .setInterpolator(OvershootInterpolator())
            .setListener(object : Animator.AnimatorListener {
              override fun onAnimationStart(animation: Animator) {}

              override fun onAnimationEnd(animation: Animator) {
                imageView_Pedro.animate()
                  .translationY(0f)
                  .setDuration(500)
                  .setInterpolator(OvershootInterpolator())
                  .setListener(object : Animator.AnimatorListener {
                    override fun onAnimationStart(animation: Animator) {}

                    override fun onAnimationEnd(animation: Animator) {
                      handler.postDelayed(object : Runnable {
                        override fun run() {
                          imageView_Pedro.animate()
                            .translationX(-10f)
                            .translationY(0f)
                            .setDuration(1000)
                            .setInterpolator(LinearInterpolator())
                            .start()
                        }
                      }, 1000)
                    }

                    override fun onAnimationCancel(animation: Animator) {}

                    override fun onAnimationRepeat(animation: Animator) {}
                  })
                  .start()
              }

              override fun onAnimationCancel(animation: Animator) {}

              override fun onAnimationRepeat(animation: Animator) {}
            })
        }

        override fun onAnimationRepeat(animation: Animation?) {}
      })
    } else {
      imageView_Pedro.translationX = -10f
    }

    mediaPlayer = MediaPlayer.create(this@MainActivity, R.raw.menu_music)

    if (mediaPlayer != null) {
      mediaPlayer!!.start()

      mediaPlayer!!.setVolume(sEffectVolume, sEffectVolume)

      mediaPlayer!!.setOnCompletionListener {
        if (mediaPlayer != null) {
          mediaPlayer!!.stop()
          mediaPlayer!!.release()
          mediaPlayer = null
        }
      }
    }

    val ssp8 = resources.getDimension(com.intuit.ssp.R.dimen._8ssp)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp15 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(sdp15, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scene\":1722916382,\"scenario\":\"background_thanking\",\"characters\":[{\"name\":\"Pedro\"}],\"history\":" + scenesToJson() + ",\"items\":" + itemsToJson() +  "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp), 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      for (j in 0 until scenesLength) {
        scenes.set(j, 0)
      }
      scenesLength = 0

      for (j in 0 until itemsLength) {
        items.set(j, 0)
      }
      itemsLength = 0

      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    val ssp12 = resources.getDimension(com.intuit.ssp.R.dimen._12ssp)

    val buttonSubScenes = Button(this)
    buttonSubScenes.text = "second"
    buttonSubScenes.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp12)
    buttonSubScenes.setTextColor(0xFFFFFFFF.toInt())
    buttonSubScenes.background = null

    val layoutParamsSubScenes = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSubScenes.gravity = Gravity.CENTER_HORIZONTAL
    layoutParamsSubScenes.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._120sdp), 0, 0)

    buttonSubScenes.layoutParams = layoutParamsSubScenes

    buttonSubScenes.setOnClickListener {
      if (!items.contains(1789536792)) {
        Toast.makeText(this, "You don't have the required item.", Toast.LENGTH_SHORT).show()
        items.remove(1789536792)

        return@setOnClickListener
      }

      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenes.set(scenesLength, 1722916383)
      scenesLength++

      scene2(true)
    }

    frameLayout.addView(buttonSubScenes)

    val buttonSubScenes2 = Button(this)
    buttonSubScenes2.text = "third"
    buttonSubScenes2.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp12)
    buttonSubScenes2.setTextColor(0xFFFFFFFF.toInt())
    buttonSubScenes2.background = null

    val layoutParamsSubScenes2 = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSubScenes2.gravity = Gravity.CENTER_HORIZONTAL
    layoutParamsSubScenes2.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp), 0, 0)

    buttonSubScenes2.layoutParams = layoutParamsSubScenes2

    buttonSubScenes2.setOnClickListener {
      if (mediaPlayer != null) {
        mediaPlayer!!.stop()
        mediaPlayer!!.release()
        mediaPlayer = null
      }

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenes.set(scenesLength, 1722916384)
      scenesLength++

      scene3(true)
    }

    frameLayout.addView(buttonSubScenes2)

    giveAchievement(1183596997)

    if (!items.contains(1789536792)) {
      items.set(itemsLength, 1789536792)
      itemsLength++
    }

    setContentView(frameLayout)
  }

  private fun scene4(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp), 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val sdp53 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, sdp53)
    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech
    rectangleViewSpeech.setAlpha(0.8f)
    rectangleViewSpeech.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewSpeech)

    val textViewSpeech = TextView(this)
    textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._9ssp))
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)

    textViewSpeech.layoutParams = layoutParamsSpeech

    var speechText = "\"Paths are incredible, don't you think?\" says in a happy tone"
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

    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, sdp53)

    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor
    rectangleViewAuthor.setAlpha(0.6f)
    rectangleViewAuthor.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewAuthor)

    val textViewAuthor = TextView(this)
    textViewAuthor.text = "Pedro"
    textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, sdp53)

    textViewAuthor.layoutParams = layoutParamsAuthor

    frameLayout.addView(textViewAuthor)

    val ssp8 = resources.getDimension(com.intuit.ssp.R.dimen._8ssp)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp15 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(sdp15, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scene\":1722916385,\"scenario\":\"background_thanking\",\"characters\":[{\"name\":\"Pedro\"}],\"history\":" + scenesToJson() + ",\"items\":" + itemsToJson() +  "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp), 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      for (j in 0 until scenesLength) {
        scenes.set(j, 0)
      }
      scenesLength = 0

      for (j in 0 until itemsLength) {
        items.set(j, 0)
      }
      itemsLength = 0

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp), 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      val scene = scenes.get(scenesLength - 1)

      scenesLength--
      scenes.set(scenesLength, 0)

      switchScene(scene)
    }

    frameLayout.addView(buttonBack)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenes.set(scenesLength, 1722916385)
      scenesLength++

      if (!items.contains(1789536792)) {
        no_items()
      } else {
        scene5()
      }
    }

    setContentView(frameLayout)
  }

  private fun scene5() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp), 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val sdp53 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, sdp53)
    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech
    rectangleViewSpeech.setAlpha(0.8f)
    rectangleViewSpeech.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewSpeech)

    val textViewSpeech = TextView(this)
    textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._9ssp))
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)

    textViewSpeech.layoutParams = layoutParamsSpeech

    var speechText = "\"And our multi path feature.. amazing.\""
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

    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, sdp53)

    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor
    rectangleViewAuthor.setAlpha(0.6f)
    rectangleViewAuthor.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewAuthor)

    val textViewAuthor = TextView(this)
    textViewAuthor.text = "Pedro"
    textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, sdp53)

    textViewAuthor.layoutParams = layoutParamsAuthor

    frameLayout.addView(textViewAuthor)

    val ssp8 = resources.getDimension(com.intuit.ssp.R.dimen._8ssp)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp15 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(sdp15, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scene\":1722916386,\"scenario\":\"background_thanking\",\"characters\":[{\"name\":\"Pedro\"}],\"history\":" + scenesToJson() + ",\"items\":" + itemsToJson() +  "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp), 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      for (j in 0 until scenesLength) {
        scenes.set(j, 0)
      }
      scenesLength = 0

      for (j in 0 until itemsLength) {
        items.set(j, 0)
      }
      itemsLength = 0

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp), 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenesLength--
      scenes.set(scenesLength, 0)

      scene4(false)
    }

    frameLayout.addView(buttonBack)

    setContentView(frameLayout)
  }

  private fun no_items() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp), 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val sdp53 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, sdp53)
    layoutParamsRectangleSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleViewSpeech.layoutParams = layoutParamsRectangleSpeech
    rectangleViewSpeech.setAlpha(0.8f)
    rectangleViewSpeech.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewSpeech)

    val textViewSpeech = TextView(this)
    textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._9ssp))
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)

    textViewSpeech.layoutParams = layoutParamsSpeech

    var speechText = "\"You don't have the item, sorry.\""
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

    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, sdp53)

    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor
    rectangleViewAuthor.setAlpha(0.6f)
    rectangleViewAuthor.setColor(0xFF000000.toInt())

    frameLayout.addView(rectangleViewAuthor)

    val textViewAuthor = TextView(this)
    textViewAuthor.text = "Pedro"
    textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, sdp53)

    textViewAuthor.layoutParams = layoutParamsAuthor

    frameLayout.addView(textViewAuthor)

    val ssp8 = resources.getDimension(com.intuit.ssp.R.dimen._8ssp)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp15 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(sdp15, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scene\":969329308,\"scenario\":\"background_thanking\",\"characters\":[{\"name\":\"Pedro\"}],\"history\":" + scenesToJson() + ",\"items\":" + itemsToJson() +  "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp), 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      for (j in 0 until scenesLength) {
        scenes.set(j, 0)
      }
      scenesLength = 0

      for (j in 0 until itemsLength) {
        items.set(j, 0)
      }
      itemsLength = 0

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp), 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenesLength--
      scenes.set(scenesLength, 0)

      scene4(false)
    }

    frameLayout.addView(buttonBack)

    setContentView(frameLayout)
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

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp), 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val sdp53 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, sdp53)
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
    textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._9ssp))
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)

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

    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, sdp53)

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
    textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, sdp53)

    textViewAuthor.layoutParams = layoutParamsAuthor

    if (animate) {
      val animationAuthor = AlphaAnimation(0f, 1f)
      animationAuthor.duration = 1000
      animationAuthor.interpolator = LinearInterpolator()
      animationAuthor.fillAfter = true

      textViewAuthor.startAnimation(animationAuthor)
    }

    frameLayout.addView(textViewAuthor)

    val ssp8 = resources.getDimension(com.intuit.ssp.R.dimen._8ssp)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp15 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(sdp15, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scene\":1722916383,\"scenario\":\"background_thanking\",\"characters\":[{\"name\":\"Pedro\"}],\"history\":" + scenesToJson() + ",\"items\":" + itemsToJson() +  "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp), 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      for (j in 0 until scenesLength) {
        scenes.set(j, 0)
      }
      scenesLength = 0

      for (j in 0 until itemsLength) {
        items.set(j, 0)
      }
      itemsLength = 0

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp), 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenesLength--
      scenes.set(scenesLength, 0)

      scene1(false)
    }

    frameLayout.addView(buttonBack)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenes.set(scenesLength, 1722916383)
      scenesLength++

      scene4(true)
    }

    setContentView(frameLayout)
  }

  private fun scene3(animate: Boolean) {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.raw.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.raw.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp), 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val sdp53 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, sdp53)
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
    textViewSpeech.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._9ssp))
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._270sdp), 0, 0)

    textViewSpeech.layoutParams = layoutParamsSpeech

    var speechText = "\"And this is the third scene, incredible right? With this code generator\n you can make your own visual novels in a simple way.\""
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

    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, sdp53)

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
    textViewAuthor.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    textViewAuthor.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsAuthor = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAuthor.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, sdp53)

    textViewAuthor.layoutParams = layoutParamsAuthor

    if (animate) {
      val animationAuthor = AlphaAnimation(0f, 1f)
      animationAuthor.duration = 1000
      animationAuthor.interpolator = LinearInterpolator()
      animationAuthor.fillAfter = true

      textViewAuthor.startAnimation(animationAuthor)
    }

    frameLayout.addView(textViewAuthor)

    val ssp8 = resources.getDimension(com.intuit.ssp.R.dimen._8ssp)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val sdp15 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(sdp15, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scene\":1722916384,\"scenario\":\"background_thanking\",\"characters\":[{\"name\":\"Pedro\"}],\"history\":" + scenesToJson() + ",\"items\":" + itemsToJson() +  "}"

      if (saves == "[]") saves = "[" + newSave + "]"
      else saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp), 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      for (j in 0 until scenesLength) {
        scenes.set(j, 0)
      }
      scenesLength = 0

      for (j in 0 until itemsLength) {
        items.set(j, 0)
      }
      itemsLength = 0

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("VNConfig", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
        mediaPlayer!!.setVolume(volume, volume)

        mediaPlayer!!.setOnCompletionListener {
          mediaPlayer!!.start()
        }
      }

      menu()
    }

    frameLayout.addView(buttonMenu)

    val buttonBack = Button(this)
    buttonBack.text = "Back"
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, ssp8)
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(sdp15, resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp), 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenesLength--
      scenes.set(scenesLength, 0)

      scene1(false)
    }

    frameLayout.addView(buttonBack)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scenes.set(scenesLength, 1722916384)
      scenesLength++

      scene4(true)
    }

    setContentView(frameLayout)
  }

  private fun switchScene(scene: Int) {
    when (scene) {
      1722916382 -> scene1(false)
      1722916385 -> scene4(false)
      1722916386 -> scene5()
      969329308 -> no_items()
      1722916383 -> scene2(false)
      1722916384 -> scene3(false)
    }
  }

  private fun giveAchievement(achievement: Int) {
    val inputStream = openFileInput("achievements.json")
    var text = inputStream.bufferedReader().use { it.readText() }
    inputStream.close()

    if (text == "[]") text = "[" + achievement + "]"
    else {
      val achievementsJson = JSONArray(text)

      for (i in 0 until achievementsJson.length()) {
        if (achievementsJson.getInt(i) == achievement) return
      }

      text = text.dropLast(1) + ", " + achievement + "]"
    }

    val outputStream = openFileOutput("achievements.json", Context.MODE_PRIVATE)
    outputStream.write(text.toByteArray())
    outputStream.close()
  }

  private fun itemsToJson(): String {
    var json = "["

    for (i in 0 until itemsLength) {
      json += items.get(i).toString() + ","
    }

    return json.dropLast(1) + "]"
  }

  private fun scenesToJson(): String {
    var json = "["

    for (i in 0 until scenesLength) {
      json += scenes.get(i).toString() + ","
    }

    return json.dropLast(1) + "]"
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
