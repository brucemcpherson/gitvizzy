/**
 * makes base64 strings to avoid invalid string stuff withkv stores
 * @param {object} obj object to compress
 * @return {string} as base64
 */
const lz = require('lz-string')
const compress = (obj) => { 
  return compressString (JSON.stringify(obj))
}
/**
 * 
 * @param {string} str string to compress
 * @return {string} as base64
 */
const compressString = (str) => lz.compressToBase64(str)

/**
 * 
 * @param {string} str b64 string to decompress
 * @return {object} original object
 */
const decompress = (str) => {
  return JSON.parse(decompressString(str));
};
/**
 *
 * @param {string} str b64 string to decompress
 * @return {string}
 */
const decompressString = (str) => {
  return lz.decompressFromBase64(str);
}

module.exports = {
  compress,
  compressString,
  decompress,
  decompressString
}