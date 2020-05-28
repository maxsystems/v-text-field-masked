export const defaultDelimiters = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/

export const isMaskDelimiter = char => char ? defaultDelimiters.test(char) : false

const allowedMasks = {
  '#': {
    test: char => /[0-9]/.test(char)
  },
  A: {
    test: char => /[A-Z]/i.test(char),
    convert: char => char.toUpperCase()
  },
  a: {
    test: char => /[a-z]/i.test(char),
    convert: char => char.toLowerCase()
  },
  N: {
    test: char => /[0-9A-Z]/i.test(char),
    convert: char => char.toUpperCase()
  },
  n: {
    test: char => /[0-9a-z]/i.test(char),
    convert: char => char.toLowerCase()
  },
  X: {
    test: isMaskDelimiter
  }
}

const isMask = char => Object.prototype.hasOwnProperty.call(allowedMasks, char)

const convert = (mask, char) => allowedMasks[mask].convert ? allowedMasks[mask].convert(char) : char

const maskValidates = (mask, char) => {
  if (char == null || !isMask(mask)) return false
  return allowedMasks[mask].test(char)
}

export const maskText = (text, masked, dontFillMaskBlanks) => {
  if (text == null) return ''
  text = String(text)
  if (!masked.length || !text.length) return text
  if (!Array.isArray(masked)) masked = masked.split('')

  let textIndex = 0
  let maskIndex = 0
  let newText = ''

  while (maskIndex < masked.length) {
    const mask = masked[maskIndex]

    // Assign the next character
    const char = text[textIndex]

    // Check if mask is delimiter
    // and current char matches
    if (!isMask(mask) && char === mask) {
      newText += mask
      textIndex++
      // Check if not mask
    } else if (!isMask(mask) && !dontFillMaskBlanks) {
      newText += mask
      // Check if is mask and validates
    } else if (maskValidates(mask, char)) {
      newText += convert(mask, char)
      textIndex++
    } else {
      return newText
    }

    maskIndex++
  }

  return newText
}

export const unmaskText = (text) => text ? String(text).replace(new RegExp(defaultDelimiters, 'g'), '') : text
