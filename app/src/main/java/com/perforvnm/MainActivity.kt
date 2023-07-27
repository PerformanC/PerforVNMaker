package com.perforvnm

import android.os.Bundle
import android.widget.ImageView
import android.widget.FrameLayout
import android.widget.Button
import android.widget.Toast
import android.view.ViewGroup.LayoutParams
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.perforvnm.ui.theme.PerforVNMTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
      setContent {
        PerforVNMTheme {
          Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
          ) {
            val frameLayout_menu = FrameLayout(this)

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
  }

  public fun scene1() {
    val frameLayout_scene1 = FrameLayout(this)

    val imageView_scene1 = ImageView(this)
    imageView_scene1.setImageResource(R.drawable.scenario)
    imageView_scene1.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout_scene1.addView(imageView_scene1)

    val imageView_scene1_venix = ImageView(this)
    imageView_scene1_venix.setImageResource(R.drawable.venix_looking)
    imageView_scene1_venix.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout_scene1.addView(imageView_scene1_venix)

    setContentView(frameLayout_scene1)

    val rootLayout = findViewById<FrameLayout>(android.R.id.content)

    rootLayout.setOnClickListener {
      scene2()
    }
  }

  public fun scene2() {
    val frameLayout_scene2 = FrameLayout(this)

    val imageView_scene2 = ImageView(this)
    imageView_scene2.setImageResource(R.drawable.scenario)
    imageView_scene2.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout_scene2.addView(imageView_scene2)

    val imageView_scene2_venix = ImageView(this)
    imageView_scene2_venix.setImageResource(R.drawable.venix_sad)
    imageView_scene2_venix.scaleType = ImageView.ScaleType.FIT_CENTER

    frameLayout_scene2.addView(imageView_scene2_venix)

    setContentView(frameLayout_scene2)
  }
}
