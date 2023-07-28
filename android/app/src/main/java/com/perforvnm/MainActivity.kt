package com.perforvnm

import android.os.Build
import android.os.Bundle
import android.widget.TextView
import android.widget.ImageView
import android.widget.FrameLayout
import android.widget.Button
import android.view.View
import android.view.Gravity
import android.view.ViewGroup.LayoutParams
import android.view.WindowManager
import android.graphics.PorterDuff
import android.graphics.Paint
import android.graphics.Canvas
import android.content.Context
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent

class MainActivity : ComponentActivity() {
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
        menu()
      }
  }

  private fun scene1() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.drawable.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.drawable.pedro_staring)
    imageView_Pedro.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_Pedro)

    setContentView(frameLayout)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      scene2()
    }
  }

  private fun scene2() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.drawable.background_thanking)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_Pedro = ImageView(this)
    imageView_Pedro.setImageResource(R.drawable.pedro_staring)
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
    rectangleViewSpeech.setColor(0xFF808080.toInt())

    frameLayout.addView(rectangleViewSpeech)

    val textViewSpeech = TextView(this)
    textViewSpeech.text = "Welcome, user. Thanks for testing our code generator, this is an *basic*\n example of usage of the PerforVNM."
    textViewSpeech.textSize = 13f
    textViewSpeech.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsSpeech = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsSpeech.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsSpeech.setMargins(0, 0, 0, 80)

    textViewSpeech.layoutParams = layoutParamsSpeech

    frameLayout.addView(textViewSpeech)

    val rectangleViewAuthor = RectangleView(this)

    val layoutParamsRectangleAuthor = FrameLayout.LayoutParams(1920, 70)
    layoutParamsRectangleAuthor.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
    layoutParamsRectangleAuthor.setMargins(0, 0, 0, 200)

    rectangleViewAuthor.layoutParams = layoutParamsRectangleAuthor
    rectangleViewAuthor.setAlpha(0.8f)
    rectangleViewAuthor.setColor(0xFF5A5A5A.toInt())

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

    val button = Button(this)
    button.text = "Back"
    button.textSize = 10f
    button.setTextColor(0xFFFFFFFF.toInt())
    button.background = null

    val layoutParamsBack = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsBack.gravity = Gravity.TOP or Gravity.START
    layoutParamsBack.setMargins(50, 0, 0, 50)

    button.layoutParams = layoutParamsBack

    button.setOnClickListener {
      scene1()
    }

    frameLayout.addView(button)

    setContentView(frameLayout)
  }

  private fun menu() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.drawable.menu)
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
      about()
    }

    frameLayout.addView(buttonAbout)

    setContentView(frameLayout)
  }

  private fun about() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView = ImageView(this)
    imageView.setImageResource(R.drawable.menu)
    imageView.scaleType = ImageView.ScaleType.FIT_CENTER

    imageView.setAlpha(0.5f)

    frameLayout.addView(imageView)

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
      about()
    }

    frameLayout.addView(buttonAbout)

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

    textView2.setOnClickListener {
      startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("https://github.com/PerformanC/PerforVNMaker")))
    }

    frameLayout.addView(textView2)

    val textView3 = TextView(this)
    textView3.text = "1.0.2-alpha"
    textView3.textSize = 15f
    textView3.setTextColor(0xFFFFFFFF.toInt())

    val layoutParamsText3 = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsText3.gravity = Gravity.TOP or Gravity.START
    layoutParamsText3.setMargins(740, 303, 0, 0)

    textView3.layoutParams = layoutParamsText3

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

    frameLayout.addView(textView4)

    setContentView(frameLayout)
  }
}

class RectangleView(context: Context) : View(context) {
  private val paint = Paint().apply {
    color = 0xFF808080.toInt()
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
