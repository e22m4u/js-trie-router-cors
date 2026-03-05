/**
 * Check whether a value is a Promise-like
 * instance. Recognizes both native promises
 * and third-party promise libraries.
 *
 * @param value
 */
export declare function isPromise<T = unknown>(
  value: unknown,
): value is Promise<T>;
