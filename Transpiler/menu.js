import helper from './helper.js'

function make(backgroundImage) {
  console.log('Starting VN, writing menu.. (Android)')

  helper.writeLine('val frameLayout_menu = FrameLayout(this)' + '\n' +
                   SPACE + 'frameLayout_menu.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                   SPACE + 'val imageView_menu = ImageView(this)' + '\n' +
                   SPACE + 'imageView_menu.setImageResource(R.drawable.' + backgroundImage + ')' + '\n' +
                   SPACE + 'imageView_menu.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   SPACE + 'frameLayout_menu.addView(imageView_menu)' + '\n\n' +

                   SPACE + 'val button = Button(this)' + '\n' +
                   SPACE + 'button.text = "Start"' + '\n' +
                   SPACE + 'button.textSize = 10f' + '\n' +
                   SPACE + 'button.setTextColor(Color.WHITE)' + '\n' +
                   SPACE + 'button.background = null' + '\n\n' +

                   SPACE + 'val layoutParams = FrameLayout.LayoutParams(' + '\n' +
                   SPACE + '  LayoutParams.WRAP_CONTENT,' + '\n' +
                   SPACE + '  LayoutParams.WRAP_CONTENT' + '\n' +
                   SPACE + ')' + '\n\n' +

                   SPACE + 'layoutParams.gravity = android.view.Gravity.BOTTOM or android.view.Gravity.CENTER_HORIZONTAL' + '\n' +
                   SPACE + 'layoutParams.setMargins(0, 0, 0, 50)' + '\n\n' +

                   SPACE + 'button.layoutParams = layoutParams' + '\n\n' +

                   SPACE + 'button.setOnClickListener {' + '\n' +
                   SPACE + '  ' + visualNovel.scenes[0].name + '()' + '\n' +
                   SPACE + '}' + '\n\n' +

                   SPACE + 'frameLayout_menu.addView(button)' + '\n\n' +

                   SPACE + 'setContentView(frameLayout_menu)')

  console.log('Menu was coded. (Android)')
}

export default {
  make
}