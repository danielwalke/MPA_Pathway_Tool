/**
 *
 * @param string
 * @param n
 * @returns substring with last n characters
 */
export const getNLastChars = (string, n) => string.substring(string.length - n, string.length)

/**
 *
 * @param string
 * @param n
 * @returns substring which cut off last n character
 */
export const getLengthMinusNFirstChars = (string, n) => string.substring(0, string.length - n)
