/**
 * Error of a HTTP request send with fetch.
 */
class HttpError extends Error {
  /**
   * Create the error.
   *
   * @param {string} message
   * @param {number} status
   * @param {any} body
   */
  constructor(message, status, body = null) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.body = body;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }

    this.stack = new Error().stack;
  }
}

export default HttpError;
