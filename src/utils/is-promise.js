/**
 * Check whether a value is a Promise-like
 * instance. Recognizes both native promises
 * and third-party promise libraries.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isPromise(value) {
  if (!value) {
    return false;
  }
  if (typeof value !== 'object') {
    return false;
  }
  return typeof value.then === 'function';
}
