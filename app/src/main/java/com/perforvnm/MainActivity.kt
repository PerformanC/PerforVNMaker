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
import com.perforvnm.ui.theme.PerforVNMTheme

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
        PerforVNMTheme {
          menu()
        }
      }
  }

  private fun scene1() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.drawable.scenario)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_venix = ImageView(this)
    imageView_venix.setImageResource(R.drawable.venix_looking)
    imageView_venix.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_venix)

    setContentView(frameLayout)

    findViewById<FrameLayout>(android.R.id.content).setOnClickListener {
      scene2()
    }
  }

  private fun scene2() {
    val frameLayout = FrameLayout(this)
    frameLayout.setBackgroundColor(0xFF000000.toInt())

    val imageView_scenario = ImageView(this)
    imageView_scenario.setImageResource(R.drawable.scenario)
    imageView_scenario.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_scenario)

    val imageView_venix = ImageView(this)
    imageView_venix.setImageResource(R.drawable.venix_sad)
    imageView_venix.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout.addView(imageView_venix)

    val button = Button(this)
    button.text = "Back"
    button.textSize = 10f
    button.setTextColor(0xFFFFFFFF.toInt())
    button.background = null

    val layoutParams = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParams.gravity = Gravity.TOP or Gravity.START
    layoutParams.setMargins(50, 0, 0, 50)

    button.layoutParams = layoutParams

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

    val layoutParams = FrameLayout.LayoutParams(1920, 150)
    layoutParams.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParams
    rectangleView.setAlpha(0.5f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 20f
    buttonStart.setTextColor(0xFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(300, 0, 0, 20)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      scene1()
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.textSize = 20f
    buttonAbout.setTextColor(0xFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(550, 0, 0, 20)

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

    val layoutParamsRectangle = FrameLayout.LayoutParams(1920, 150)
    layoutParamsRectangle.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL

    rectangleView.layoutParams = layoutParamsRectangle
    rectangleView.setAlpha(0.5f)

    frameLayout.addView(rectangleView)

    val buttonStart = Button(this)
    buttonStart.text = "Start"
    buttonStart.textSize = 20f
    buttonStart.setTextColor(0xFFFFFFFF.toInt())
    buttonStart.background = null

    val layoutParamsStart = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsStart.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsStart.setMargins(300, 0, 0, 20)

    buttonStart.layoutParams = layoutParamsStart

    buttonStart.setOnClickListener {
      scene1()
    }

    frameLayout.addView(buttonStart)

    val buttonAbout = Button(this)
    buttonAbout.text = "About"
    buttonAbout.textSize = 20f
    buttonAbout.setTextColor(0xFFFFFFFF.toInt())
    buttonAbout.background = null

    val layoutParamsAbout = FrameLayout.LayoutParams(
      LayoutParams.WRAP_CONTENT,
      LayoutParams.WRAP_CONTENT
    )

    layoutParamsAbout.gravity = Gravity.BOTTOM or Gravity.START
    layoutParamsAbout.setMargins(550, 0, 0, 20)

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
    textView.text = "The Void 1.0.0\n\nMade with"
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
    textView2.setTextColor(0xFF007bff.toInt())

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
    textView3.text = "1.0.0-alpha"
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

  override fun onDraw(canvas: Canvas?) {
    super.onDraw(canvas)
    val rect = canvas?.clipBounds ?: return
    canvas.drawRect(rect, paint)
  }
}
