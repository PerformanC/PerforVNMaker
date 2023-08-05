package com.perforvnm

import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.DisplayMetrics
import android.util.TypedValue
import android.media.MediaPlayer
import android.widget.TextView
import android.widget.ImageView
import android.widget.FrameLayout
import android.widget.FrameLayout.LayoutParams
import android.widget.Button
import android.widget.SeekBar
import android.view.View
import android.view.Gravity
import android.view.WindowInsets
import android.view.WindowManager
import android.view.animation.Animation
import android.view.animation.LinearInterpolator
import android.view.animation.OvershootInterpolator
import android.view.animation.AlphaAnimation
import android.animation.Animator
import android.animation.ValueAnimator
import android.text.TextUtils
import android.text.SpannableStringBuilder
import android.text.style.ClickableSpan
import android.text.method.LinkMovementMethod
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
  private var sEffectVolume = 1f
  private var sceneMusicVolume = 1f
  private val displayMetrics = DisplayMetrics()
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

      window.decorView.windowInsetsController?.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())

      val windowMetrics = windowManager.currentWindowMetrics
      displayMetrics.widthPixels = windowMetrics.bounds.width()
      displayMetrics.heightPixels = windowMetrics.bounds.height()
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

      @Suppress("DEPRECATION")
      windowManager.defaultDisplay.getMetrics(displayMetrics)
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

      sEffectVolume = sharedPreferences.getFloat("sEffectVolume", 1f)

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

    val layoutParams = LayoutParams(LayoutParams.WRAP_CONTENT, (displayMetrics.heightPixels * 0.09259259259).toInt())
    layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParams
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 15f
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
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

    val layoutParamsAbout = LayoutParams(
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

    val layoutParamsSettings = LayoutParams(
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

    val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, (displayMetrics.heightPixels * 0.09259259259).toInt())
    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParamsRectangle
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 15f
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
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

    val layoutParamsAbout = LayoutParams(
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

    val layoutParamsSettings = LayoutParams(
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

    val layoutParamsBack = LayoutParams(
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
    textView.text = SpannableStringBuilder().apply {
      append("The PerforVNM 1.0.0\n\nMade with ")
      append("PerforVNM")
      setSpan(object : ClickableSpan() {
        override fun onClick(widget: View) {
          startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("https://github.com/PerformanC/PerforVNMaker")))
        }
      }, length - "PerforVNM".length, length, 0)
      append("1.18.2-b.0 (code generator), 1.16.8-b.0 (generated code).")
      append("\n\nThis is our example visual novel, made by @ThePedroo")
    }
    textView.textSize = 15f
    textView.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(300, 200, 0, 0)

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

    val layoutParamsRectangle = LayoutParams(LayoutParams.WRAP_CONTENT, (displayMetrics.heightPixels * 0.09259259259).toInt())
    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParamsRectangle
    rectangleView.setAlpha(0.8f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 15f
    buttonStart.setTextColor(0xFFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = LayoutParams(
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

    val layoutParamsAbout = LayoutParams(
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

    val layoutParamsSettings = LayoutParams(
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

    val layoutParamsBack = LayoutParams(
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

    val layoutParamsText = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val resourceDisplayMetrics = getResources().getDisplayMetrics()

    val leftDpTextSpeed = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 204f, resourceDisplayMetrics).toInt()
    val topDpTextSpeed = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 77f, resourceDisplayMetrics).toInt()

    layoutParamsText.gravity = Gravity.TOP or Gravity.START
    layoutParamsText.setMargins(leftDpTextSpeed, topDpTextSpeed, 0, 0)

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

    val layoutParamsSeekBar = LayoutParams(
      500,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpSeekBarSpeed = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 188f, resourceDisplayMetrics).toInt()
    val topDpSeekBarSpeed = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 100f, resourceDisplayMetrics).toInt()

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
    textViewMusicVolume.textSize = 15f
    textViewMusicVolume.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextMusicVolume = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpRightTexts = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 591f, resourceDisplayMetrics).toInt()
    val topDpTextMusicVolume = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 77f, resourceDisplayMetrics).toInt()

    layoutParamsTextMusicVolume.gravity = Gravity.TOP or Gravity.START
    layoutParamsTextMusicVolume.setMargins(leftDpRightTexts, topDpTextMusicVolume, 0, 0)

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

    val layoutParamsSeekBarMusicVolume = LayoutParams(
      500,
      LayoutParams.WRAP_CONTENT
    )

    val leftDpRightSeekbars = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 576f, resourceDisplayMetrics).toInt()
    val topDpSeekBarMusicVolume = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 100f, resourceDisplayMetrics).toInt()

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
    textViewSEffectVolume.textSize = 15f
    textViewSEffectVolume.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextSEffectVolume = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpSeekBarSEffectVolume = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 126f, resourceDisplayMetrics).toInt()

    layoutParamsTextSEffectVolume.gravity = Gravity.TOP or Gravity.START
    layoutParamsTextSEffectVolume.setMargins(leftDpRightTexts, topDpSeekBarSEffectVolume, 0, 0)

    textViewSEffectVolume.layoutParams = layoutParamsTextSEffectVolume
    textViewSEffectVolume.startAnimation(animationTexts)

    frameLayout.addView(textViewSEffectVolume)

    val seekBarSEffectVolume = SeekBar(this)
    seekBarSEffectVolume.max = 100
    seekBarSEffectVolume.progress = (sEffectVolume * 100).toInt()

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
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
      500,
      LayoutParams.WRAP_CONTENT
    )

    val topDpTextSEffectVolume = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 150f, resourceDisplayMetrics).toInt()

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
    textViewSceneMusic.textSize = 15f
    textViewSceneMusic.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsTextSceneMusic = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    val topDpSeekBarSceneMusic = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 176f, resourceDisplayMetrics).toInt()

    layoutParamsTextSceneMusic.gravity = Gravity.TOP or Gravity.START
    layoutParamsTextSceneMusic.setMargins(leftDpRightTexts, topDpSeekBarSceneMusic, 0, 0)

    textViewSceneMusic.layoutParams = layoutParamsTextSceneMusic
    textViewSceneMusic.startAnimation(animationTexts)

    frameLayout.addView(textViewSceneMusic)

    val seekBarSceneMusic = SeekBar(this)
    seekBarSceneMusic.max = 100
    seekBarSceneMusic.progress = (sceneMusicVolume * 100).toInt()

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
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
      500,
      LayoutParams.WRAP_CONTENT
    )

    val topDpTextSceneMusic = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 200f, resourceDisplayMetrics).toInt()

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

    imageView_Pedro.startAnimation(animationFadeIn)

    animationFadeIn.setAnimationListener(object : Animation.AnimationListener {
      override fun onAnimationStart(animation: Animation?) {}

      override fun onAnimationEnd(animation: Animation?) {
        imageView_Pedro.animate()
          .translationY(-100f)
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
                          .translationX(200f)
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

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.textSize = 10f
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
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

      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

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

      handler.removeCallbacksAndMessages(null)
      it.setOnClickListener(null)

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

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(200, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val rectangleViewSpeech = RectangleView(this)

    val layoutParamsRectangleSpeech = LayoutParams(LayoutParams.WRAP_CONTENT, 200)
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

    val layoutParamsSpeech = LayoutParams(
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

    val layoutParamsRectangleAuthor = LayoutParams(LayoutParams.WRAP_CONTENT, 70)
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

    val layoutParamsAuthor = LayoutParams(
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

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(50, 0, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("PerforVNM", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
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
    buttonBack.textSize = 10f
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(50, 80, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      handler.removeCallbacksAndMessages(null)

      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      scene1()
    }

    frameLayout.addView(buttonBack)

    setContentView(frameLayout)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      handler.removeCallbacksAndMessages(null)
      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)
      it.setOnClickListener(null)

      val animationRectangleSpeech = AlphaAnimation(0.8f, 0f)
      animationRectangleSpeech.duration = 500
      animationRectangleSpeech.interpolator = LinearInterpolator()
      animationRectangleSpeech.fillAfter = true

      rectangleViewSpeech.startAnimation(animationRectangleSpeech)

      val animationTextSpeech = AlphaAnimation(1f, 0f)
      animationTextSpeech.duration = 500
      animationTextSpeech.interpolator = LinearInterpolator()
      animationTextSpeech.fillAfter = true

      textViewSpeech.startAnimation(animationTextSpeech)

      val animationAuthorSpeech = AlphaAnimation(0.6f, 0f)
      animationAuthorSpeech.duration = 500
      animationAuthorSpeech.interpolator = LinearInterpolator()
      animationAuthorSpeech.fillAfter = true

      rectangleViewAuthor.startAnimation(animationAuthorSpeech)

      textViewAuthor.startAnimation(animationTextSpeech)

      animationAuthorSpeech.setAnimationListener(object : Animation.AnimationListener {
        override fun onAnimationStart(animation: Animation?) {}

        override fun onAnimationEnd(animation: Animation?) {
          scene3()
        }

        override fun onAnimationRepeat(animation: Animation?) {}
      })
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

    val layoutParams_Pedro = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams_Pedro.gravity = Gravity.CENTER
    layoutParams_Pedro.setMargins(200, 0, 0, 0)

    imageView_Pedro.layoutParams = layoutParams_Pedro

    frameLayout.addView(imageView_Pedro)

    val buttonMenu = Button(this)
    buttonMenu.text = "Menu"
    buttonMenu.textSize = 10f
    buttonMenu.setTextColor(0xFFFFFFFF.toInt())
    buttonMenu.background = null

    val layoutParamsMenu = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsMenu.gravity = Gravity.TOP or Gravity.START
    layoutParamsMenu.setMargins(50, 0, 0, 0)

    buttonMenu.layoutParams = layoutParamsMenu

    buttonMenu.setOnClickListener {
      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

      mediaPlayer = MediaPlayer.create(this, R.raw.menu_music)

      if (mediaPlayer != null) {
        mediaPlayer!!.start()

        val volume = getSharedPreferences("PerforVNM", Context.MODE_PRIVATE).getFloat("musicVolume", 1f)
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
    buttonBack.textSize = 10f
    buttonBack.setTextColor(0xFFFFFFFF.toInt())
    buttonBack.background = null

    val layoutParamsBack = LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(50, 80, 0, 0)

    buttonBack.layoutParams = layoutParamsBack

    buttonBack.setOnClickListener {
      findViewById<FrameLayout>(android.R.id.content).setOnClickListener(null)

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
