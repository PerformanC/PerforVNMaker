export function _AddResource(page, resource) {
  if (page.resources[`${resource.dp}${resource.type}`]) return page

  page.resources = {
    ...page.resources,
    [`${resource.dp}${resource.type}`]: {
      type: resource.type,
      dp: resource.dp,
      spaces: resource.spaces,
      ...(resource.newLines ? { newLines: resource.newLines } : {})
    }
  }

  return page
}

export function _GetResource(page, resource) {
  const cResource = page.resources[`${resource.dp}${resource.type}`]

  if (!visualNovel.optimizations.reuseResources) return {
    definition: '',
    inlined: `resources.getDimension${resource.type == 'sdp' ? 'PixelSize' : ''}(com.intuit.${resource.type}.R.dimen._${resource.dp}${resource.type})`,
    variable: `resources.getDimension${resource.type == 'sdp' ? 'PixelSize' : ''}(com.intuit.sdp.R.dimen._${resource.dp}${resource.type})`,
    additionalSpace: '\n'
  }

  return {
    definition: cResource ? '' : `__PERFORVNM_${resource.dp}_${resource.type}_DEFINE__`,
    inlined: `__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`,
    variable: `__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`,
    additionalSpace: cResource ? '\n\n' : ''
  }
}

export function _GetMultiResources(page, page2, resource) {
  let cResource = null

  cResource = _GetResource(page, resource)
  if (cResource.definition) cResource = _GetResource(page2, resource)

  return cResource
}

export function _FinalizeResources(page, code) {
  Object.keys(page.resources).forEach((key) => {
    const resource = page.resources[key]

    const defineRegex = new RegExp(`__PERFORVNM_${resource.dp}_${resource.type}_DEFINE__`, 'g')
    const inlineRegex = new RegExp(`__PERFORVNM_${resource.dp}_${resource.type}_INLINE__`, 'g')
    const variableRegex = new RegExp(`__PERFORVNM_${resource.dp}_${resource.type}_VARIABLE__`, 'g')

    const variableAmount = code.split(variableRegex).length - 1

    if (variableAmount == 1) {
      code = code.replace(defineRegex, '')

      code = code.replace(variableRegex, `resources.getDimension${resource.type == 'sdp' ? 'PixelSize' : ''}(com.intuit.${resource.type}.R.dimen._${resource.dp}${resource.type})`)
    }

    let spaces = ''
    for (let i = 0; i < resource.spaces; i++) {
      spaces += ' '
    }

    code = code.replace(defineRegex, `val ${resource.type}${resource.dp} = resources.getDimension${resource.type == 'sdp' ? 'PixelSize' : ''}(com.intuit.${resource.type}.R.dimen._${resource.dp}${resource.type})${resource.newLines ? resource.newLines : '\n\n'}${spaces}`)
    code = code.replace(inlineRegex, `resources.getDimension${resource.type == 'sdp' ? 'PixelSize' : ''}(com.intuit.${resource.type}.R.dimen._${resource.dp}${resource.type})`)
    code = code.replace(variableRegex, `${resource.type}${resource.dp}`)
  })

  return code
}

export function _FinalizeMultiResources(page, page2, code) {
  code = _FinalizeResources(page, code)
  code = _FinalizeResources(page2, code)

  return code
}