import helper from './helper.js'

function make(backgroundImage) {
  console.log('Starting VN, coding menu.. (Android)')

  helper.writeLine('val frameLayout = FrameLayout(this)' + '\n' +
                   SPACE + 'frameLayout.setBackgroundColor(0xFF000000.toInt())' + '\n\n' +

                   SPACE + 'val imageView = ImageView(this)' + '\n' +
                   SPACE + 'imageView.setImageResource(R.drawable.' + backgroundImage + ')' + '\n' +
                   SPACE + 'imageView.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   SPACE + 'frameLayout.addView(imageView)' + '\n\n' +

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

                   SPACE + 'frameLayout.addView(button)' + '\n\n' +

                   SPACE + 'setContentView(frameLayout)')

  console.log('Menu coded. (Android)')
}

export default {
  make
}