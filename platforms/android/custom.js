import helper from '../main/helper.js'
import { _GetResource, _AddResource, _FinalizeResources } from './helpers/optimizations.js'

export function _AddCustoms(page, customs) {
  let pageCode = ''

  customs.forEach((custom, index) => {
    switch (custom.type) {
      case 'text': {
        const customTextSsp = _GetResource(page, { type: 'ssp', dp: custom.fontSize })
        page = _AddResource(page, { type: 'ssp', dp: custom.fontSize, spaces: 4 })

        pageCode += helper.codePrepare(`
          ${customTextSsp.definition}val textViewCustomText${index} = TextView(this)
          textViewCustomText${index}.text = "${custom.text}"
          textViewCustomText${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${customTextSsp.variable})
          textViewCustomText${index}.setTextColor(0xFF${custom.color}.toInt())

          val layoutParamsCustomText${index} = LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT
          )\n\n`, 6
        )

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.top })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.side })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            pageCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomText${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomText${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            pageCode += helper.codePrepare(`
              layoutParamsCustomText${index}.gravity = Gravity.CENTER

              textViewCustomText${index}.layoutParams = layoutParamsCustomText${index}

              frameLayout.addView(textViewCustomText${index})\n\n`, 12
            )

            break
          }
        }

        break
      }
      case 'button': {
        const customTextSsp = _GetResource(page, { type: 'ssp', dp: custom.fontSize })
        page = _AddResource(page, { type: 'ssp', dp: custom.fontSize, spaces: 4 })

        pageCode += helper.codePrepare(`
          ${customTextSsp.definition}val buttonCustomButton${index} = Button(this)
          buttonCustomButton${index}.text = "${custom.text}"
          buttonCustomButton${index}.setTextSize(TypedValue.COMPLEX_UNIT_PX, ${customTextSsp.variable})
          buttonCustomButton${index}.setTextColor(0xFF${custom.color}.toInt())
          buttonCustomButton${index}.background = null__PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomButton${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            pageCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            pageCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = _GetResource(page, { type: 'sdp', dp: custom.height })
            page = _AddResource(page, { type: 'sdp', dp: custom.height, spaces: 4 })

            if (customHeight.definition) pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__`)

            pageCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            pageCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            pageCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = _GetResource(page, { type: 'sdp', dp: custom.width })
            page = _AddResource(page, { type: 'sdp', dp: custom.width, spaces: 4 })

            if (customWidth.definition) pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            pageCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', '')
        pageCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.top })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.side })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            pageCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomButton${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomButton${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

              frameLayout.addView(buttonCustomButton${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            pageCode += helper.codePrepare(`
              layoutParamsCustomButton${index}.gravity = Gravity.CENTER

              buttonCustomButton${index}.layoutParams = layoutParamsCustomButton${index}

              frameLayout.addView(buttonCustomButton${index})\n\n`, 10
            )

            break
          }
        }

        break
      }
      case 'rectangle': {
        pageCode += helper.codePrepare(`
          val rectangleViewCustomRectangle${index} = RectangleView(this)__PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomRectangle${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            pageCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            pageCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = _GetResource(page, { type: 'sdp', dp: custom.height })
            page = _AddResource(page, { type: 'sdp', dp: custom.height, spaces: 4 })

            if (customHeight.definition) pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__${customHeight.additionalSpace}`)

            pageCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            pageCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            pageCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = _GetResource(page, { type: 'sdp', dp: custom.width })
            page = _AddResource(page, { type: 'sdp', dp: custom.width, spaces: 4 })

            if (customWidth.definition) pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            pageCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', '')
        pageCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.top })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.side })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            pageCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomRectangle${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomRectangle${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

              frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            pageCode += helper.codePrepare(`
              layoutParamsCustomRectangle${index}.gravity = Gravity.CENTER

              rectangleViewCustomRectangle${index}.layoutParams = layoutParamsCustomRectangle${index}

              frameLayout.addView(rectangleViewCustomRectangle${index})\n\n`, 10
            )

            break
          }
        }

        break
      }
      case 'image': {
        pageCode += helper.codePrepare(`
          val imageViewCustomImage${index} = ImageView(this)
          imageViewCustomImage${index}.setImageResource(R.drawable.${custom.image})

          __PERFORVNM_OPTIMIZED_RESOURCE__

          val layoutParamsCustomImage${index} = LayoutParams(\n`, 6
        )

        switch (custom.height) {
          case 'match': {
            pageCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            pageCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customHeight = _GetResource(page, { type: 'sdp', dp: custom.height })
            page = _AddResource(page, { type: 'sdp', dp: custom.height, spaces: 4 })

            if (customHeight.definition) pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customHeight.definition}__PERFORVNM_OPTIMIZED_RESOURCE__`)

            pageCode += helper.codePrepare(`${customHeight.variable},\n`, 0, 6, false)
          }
        }

        switch (custom.width) {
          case 'match': {
            pageCode += helper.codePrepare('LayoutParams.MATCH_PARENT,\n', 0, 6, false)

            break
          }
          case 'wrap': {
            pageCode += helper.codePrepare('LayoutParams.WRAP_CONTENT,\n', 0, 6, false)

            break
          }
          default: {
            const customWidth = _GetResource(page, { type: 'sdp', dp: custom.width })
            page = _AddResource(page, { type: 'sdp', dp: custom.width, spaces: 4 })

            if (customWidth.definition) pageCode = pageCode.replace('__PERFORVNM_OPTIMIZED_RESOURCE__', `\n\n    ${customWidth.definition}`)

            pageCode += helper.codePrepare(`${customWidth.variable},\n`, 0, 6, false)
          }
        }

        pageCode += helper.codePrepare(')\n\n', 0, 4, false)

        switch (custom.position.side) {
          case 'left':
          case 'right': {
            let definitions = ''

            let marginTopSdp = null
            if (custom.position.margins.top != 0) {
              marginTopSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.top })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.top, spaces: 4 })

              if (marginTopSdp.definition) definitions += marginTopSdp.definition
            }

            let marginSideSdp = null
            if (custom.position.margins.side != 0) {
              marginSideSdp = _GetResource(page, { type: 'sdp', dp: custom.position.margins.side })
              page = _AddResource(page, { type: 'sdp', dp: custom.position.margins.side, spaces: 4 })

              if (marginSideSdp.definition) definitions += marginSideSdp.definition
            }

            pageCode += helper.codePrepare(`
              ${definitions}layoutParamsCustomImage${index}.gravity = Gravity.TOP or Gravity.START
              layoutParamsCustomImage${index}.setMargins(${custom.position.margins.side != 0 ? marginSideSdp.variable : '0'}, 0, ${custom.position.margins.top != 0 ? marginTopSdp.variable : '0'}, 0)

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})\n\n`, 10
            )

            break
          }
          case 'center': {
            pageCode += helper.codePrepare(`
              layoutParamsCustomImage${index}.gravity = Gravity.CENTER

              imageViewCustomImage${index}.layoutParams = layoutParamsCustomImage${index}

              frameLayout.addView(imageViewCustomImage${index})`, 10
            )

            break
          }
        }

        break
      }
    }
  })

  pageCode = _FinalizeResources(page, pageCode)

  return pageCode
}
