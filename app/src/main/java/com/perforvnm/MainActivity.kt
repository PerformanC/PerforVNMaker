package com.perforvnm

import android.os.Bundle
import android.widget.ImageView
import android.widget.FrameLayout
import android.widget.Button
import android.os.Build
import android.view.View
import android.view.ViewGroup.LayoutParams
import android.view.WindowManager
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
          val frameLayout_menu = FrameLayout(this)
          frameLayout_menu.setBackgroundColor(0xFF000000.toInt())

          val imageView_menu = ImageView(this)
          imageView_menu.setImageResource(R.drawable.menu)
          imageView_menu.scaleType = ImageView.ScaleType.FIT_CENTER

          frameLayout_menu.addView(imageView_menu)

          val button = Button(this)
          button.text = "Start"

          val layoutParams = FrameLayout.LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
          )
          layoutParams.gravity = android.view.Gravity.CENTER_HORIZONTAL or android.view.Gravity.BOTTOM
          button.layoutParams = layoutParams

          button.setOnClickListener {
            scene1()
          }

          frameLayout_menu.addView(button)

          setContentView(frameLayout_menu)
        }
      }
  }

  public fun scene1() {
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

  public fun scene2() {
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

    setContentView(frameLayout)
  }
}
