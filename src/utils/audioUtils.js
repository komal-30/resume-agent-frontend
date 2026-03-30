/**
 * Convert a base64 string to a Blob.
 * @param {string} base64
 * @param {string} mimeType  e.g. 'audio/mpeg'
 * @returns {Blob}
 */
export function base64ToBlob(base64, mimeType = 'audio/mpeg') {
  const byteCharacters = atob(base64)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    byteArrays.push(new Uint8Array(byteNumbers))
  }

  return new Blob(byteArrays, { type: mimeType })
}

/**
 * Create an object URL from a Blob.
 * Remember to call URL.revokeObjectURL() when done.
 * @param {Blob} blob
 * @returns {string}
 */
export function createAudioUrl(blob) {
  return URL.createObjectURL(blob)
}
