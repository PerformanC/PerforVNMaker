package com.perforvnm

import java.io.File
import java.io.InputStreamReader
import org.json.JSONArray
import kotlin.math.roundToInt

import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.app.Activity
import android.util.TypedValue
import android.media.MediaPlayer
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
import android.content.Context
import android.content.SharedPreferences

class MainActivity : Activity() {
  private var lastScene: String? = null
  private val handler = Handler(Looper.getMainLooper())
  private var textSpeed = 1000L
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

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

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
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
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

    frameLayout.addView(buttonSaves)

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

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

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
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
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
      append("The PerforVNM 1.0.0\n\nMade with ")
      append("PerforVNM")
      setSpan(object : ClickableSpan() {
        override fun onClick(widget: View) {
          startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("https://github.com/PerformanC/PerforVNMaker")))
        }
      }, length - "PerforVNM".length, length, 0)
      append(" 1.21.0 (code generator), 1.18.8 (generated code).\n\nThis is our example visual novel, made by @ThePedroo")
    }
    textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._11ssp))
    textView.setTextColor(0xFFFFFFFF.toInt())

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

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

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
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
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
    textViewTextSpeed.setTextColor(0xFFFFFFFF.toInt())

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
    textViewMusicVolume.setTextColor(0xFFFFFFFF.toInt())

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
    textViewSEffectVolume.setTextColor(0xFFFFFFFF.toInt())

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
    textViewSceneMusic.setTextColor(0xFFFFFFFF.toInt())

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

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val bottomDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._minus3sdp)

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._88sdp), 0, 0, bottomDpButtons)

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
    buttonAbout.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._13ssp))
    buttonAbout.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSettings.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonSaves.setTextColor(0xFFFFFFFFF.toInt())
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
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
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

        switchScene(buttonData.getString("scene"))
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

        when (characterData.getJSONObject("position").getString("sideType")) {
          "left" -> {
            val leftDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad, 0, 0)
          }
          "leftTop" -> {
            val leftDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))
            val topDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("top") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

            layoutParamsImageViewCharacter.setMargins(leftDpLoad + leftDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }
          "right" -> {
            val rightDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))
            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad, 0, 0)
          }
          "rightTop" -> {
            val rightDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))
            val topDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("top") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

            layoutParamsImageViewCharacter.setMargins(leftDpLoad - rightDpCharacter, topDpLoad + topDpCharacter, 0, 0)
          }
          "top" -> {
            val topDpCharacter = resources.getDimensionPixelSize(resources.getIdentifier("_${(characterData.getJSONObject("position").getInt("side") * 0.25).roundToInt()}sdp", "dimen", getPackageName()))

            layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad + topDpCharacter, 0, 0)
          }
          "center" -> {
            layoutParamsImageViewCharacter.setMargins(leftDpLoad, topDpLoad, 0, 0)
          }
        }

        imageViewCharacter.layoutParams = layoutParamsImageViewCharacter

        frameLayoutScenes.addView(imageViewCharacter)
      }

      if (i != 0 && i % 4 == 0) {
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

  private fun scene1() {
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

    imageView_scenario.startAnimation(animationFadeIn)

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
                      .translationX(20f)
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

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(leftDpButtons, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scenario\":\"background_thanking\",\"scene\":\"scene1\",\"characters\":[{\"name\":\"Pedro\",\"image\":\"pedro_staring\",\"position\":{\"sideType\":\"center\"}}]}"

      saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpMenu = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp)

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(leftDpButtons, topDpMenu, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
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

    val buttonSubScenes = Button(this)
    buttonSubScenes.text = "second"
    buttonSubScenes.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._12ssp))
    buttonSubScenes.setTextColor(0xFFFFFFFF.toInt())
    buttonSubScenes.background = null

    val layoutParamsSubScenes = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpSubScenes = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._120sdp)

    layoutParamsSubScenes.gravity = Gravity.CENTER_HORIZONTAL
    layoutParamsSubScenes.setMargins(0, topDpSubScenes, 0, 0)

    buttonSubScenes.layoutParams = layoutParamsSubScenes

    buttonSubScenes.setOnClickListener {
      lastScene = "scene1"

      scene2(true)
    }

    frameLayout.addView(buttonSubScenes)

    val buttonSubScenes2 = Button(this)
    buttonSubScenes2.text = "third"
    buttonSubScenes2.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._12ssp))
    buttonSubScenes2.setTextColor(0xFFFFFFFF.toInt())
    buttonSubScenes2.background = null

    val layoutParamsSubScenes2 = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpSubScenes2 = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._150sdp)

    layoutParamsSubScenes2.gravity = Gravity.CENTER_HORIZONTAL
    layoutParamsSubScenes2.setMargins(0, topDpSubScenes2, 0, 0)

    buttonSubScenes2.layoutParams = layoutParamsSubScenes2

    buttonSubScenes2.setOnClickListener {
      lastScene = "scene1"

      scene3(true)
    }

    frameLayout.addView(buttonSubScenes2)

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

    val leftDp_Pedro = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp)

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(leftDp_Pedro, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val bottomDpRectangles = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, bottomDpRectangles)
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

    var speechText = "\"Paths are incredible, don't you think?\" says in a happy tone"
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
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, bottomDpRectangles)

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
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, bottomDpRectangles)

    textViewAuthor.layoutParams = layoutParamsAuthor

    if (animate) {
      val animationAuthor = AlphaAnimation(0f, 1f)
      animationAuthor.duration = 1000
      animationAuthor.interpolator = LinearInterpolator()
      animationAuthor.fillAfter = true

      textViewAuthor.startAnimation(animationAuthor)
    }

    frameLayout.addView(textViewAuthor)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(leftDpButtons, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scenario\":\"background_thanking\",\"scene\":\"scene4\",\"characters\":[{\"name\":\"Pedro\",\"image\":\"pedro_staring\",\"position\":{\"sideType\":\"left\",\"side\":20}}]}"

      saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpMenu = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp)

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(leftDpButtons, topDpMenu, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
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
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpBack = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp)

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(leftDpButtons, topDpBack, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      switchScene(lastScene!!)
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

    val leftDp_Pedro = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp)

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(leftDp_Pedro, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val bottomDpRectangles = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, bottomDpRectangles)
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
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, bottomDpRectangles)

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
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, bottomDpRectangles)

    textViewAuthor.layoutParams = layoutParamsAuthor

    if (animate) {
      val animationAuthor = AlphaAnimation(0f, 1f)
      animationAuthor.duration = 1000
      animationAuthor.interpolator = LinearInterpolator()
      animationAuthor.fillAfter = true

      textViewAuthor.startAnimation(animationAuthor)
    }

    frameLayout.addView(textViewAuthor)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(leftDpButtons, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scenario\":\"background_thanking\",\"scene\":\"scene2\",\"characters\":[{\"name\":\"Pedro\",\"image\":\"pedro_staring\",\"position\":{\"sideType\":\"left\",\"side\":20}}]}"

      saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpMenu = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp)

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(leftDpButtons, topDpMenu, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
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
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpBack = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp)

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(leftDpButtons, topDpBack, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scene1()
    }

    frameLayout.addView(buttonBack)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      lastScene = "scene2"

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

    val leftDp_Pedro = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._20sdp)

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(leftDp_Pedro, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val bottomDpRectangles = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._53sdp)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, bottomDpRectangles)
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
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, bottomDpRectangles)

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
    layoutParamsAuthor.setMargins(resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._155sdp), 0, 0, bottomDpRectangles)

    textViewAuthor.layoutParams = layoutParamsAuthor

    if (animate) {
      val animationAuthor = AlphaAnimation(0f, 1f)
      animationAuthor.duration = 1000
      animationAuthor.interpolator = LinearInterpolator()
      animationAuthor.fillAfter = true

      textViewAuthor.startAnimation(animationAuthor)
    }

    frameLayout.addView(textViewAuthor)

    val buttonSave = Button(this)
    buttonSave.text = "Save"
    buttonSave.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonSave.setTextColor(0xFFFFFFFF.toInt())
    buttonSave.background = null

    val layoutParamsSave = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpButtons = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._15sdp)

    layoutParamsSave.gravity = Gravity.TOP or Gravity.START
    layoutParamsSave.setMargins(leftDpButtons, 0, 0, 0)

    buttonSave.layoutParams = layoutParamsSave

    buttonSave.setOnClickListener {
      val inputStream = openFileInput("saves.json")
      var saves = inputStream.bufferedReader().use { it.readText() }
      inputStream.close()

      val newSave = "{\"scenario\":\"background_thanking\",\"scene\":\"scene3\",\"characters\":[{\"name\":\"Pedro\",\"image\":\"pedro_staring\",\"position\":{\"sideType\":\"left\",\"side\":20}}]}"

      saves = saves.dropLast(1) + "," + newSave + "]"

      val outputStream = openFileOutput("saves.json", Context.MODE_PRIVATE)
      outputStream.write(saves.toByteArray())
      outputStream.close()
    }

    frameLayout.addView(buttonSave)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpMenu = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._23sdp)

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(leftDpButtons, topDpMenu, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
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
    buttonBack.setTextSize(TypedValue.COMPLEX_UNIT_PX, resources.getDimension(com.intuit.ssp.R.dimen._8ssp))
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpBack = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._46sdp)

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(leftDpButtons, topDpBack, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scene1()
    }

    frameLayout.addView(buttonBack)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      lastScene = "scene3"

      scene4(true)
    }

    setContentView(frameLayout)
  }

  private fun switchScene(scene: String) {
    when (scene) {
      "scene1" -> scene1()
      "scene4" -> scene4(true)
      "scene2" -> scene2(true)
      "scene3" -> scene3(true)
    }
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
