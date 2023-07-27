import helper from './helper.js'

function make(backgroundImage) {
  console.log('Starting VN, writing menu.. (Android)')

  helper.writeLine('val frameLayout_menu = FrameLayout(this)' + '\n\n' +

                   SPACE + 'val imageView_menu = ImageView(this)' + '\n' +
                   SPACE + 'imageView_menu.setImageResource(R.drawable.' + backgroundImage + ')' + '\n' +
                   SPACE + 'imageView_menu.scaleType = ImageView.ScaleType.FIT_CENTER' + '\n\n' +

                   SPACE + 'frameLayout_menu.addView(imageView_menu)' + '\n\n' +

                   SPACE + 'val button = Button(this)' + '\n' +
                   SPACE + 'button.text = "Start"' + '\n\n' +

                   SPACE + 'val layoutParams = FrameLayout.LayoutParams(' + '\n' +
                   SPACE + '  LayoutParams.WRAP_CONTENT,' + '\n' +
                   SPACE + '  LayoutParams.WRAP_CONTENT' + '\n' +
                   SPACE + ')' + '\n' +
                   SPACE + 'layoutParams.gravity = android.view.Gravity.CENTER_HORIZONTAL or android.view.Gravity.BOTTOM' + '\n' +
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