/*********************************************************************************
 * Facilitate fetch usage
 *
 * Usage : see README.md
 ********************************************************************************/

/**
 * @typedef {Object} FetchOptions
 * @property {any} [body] - Request body. Throw an error if passed when the option `json` or `form` is used.
 * @property {HTMLFormElement|null} [form] - HTML form. Will be passed in the `body` as `new FormData(form)` and his method will be automatically used as the request's HTTP method.
 * @property {Headers|null} [headers] - HTTP headers.
 * @property {Object|null} [json] - JSON payload. Will be passed in the `body` as `JSON.stringify(options.json)`.
 * @property {string|null} [method] - HTTP method (GET, POST, etc.). If provided with the `form` option, it takes precedence.
 * @property {Object} [query] - Hash of values used to append a query string to the URL.
 * @property {Object} [rawOptions] - Additional raw options passed to `fetch`.
 * @property {int} [timeout] - Timeout for the request execution.
 * @property {boolean} [unprocessableEntityAsError=false] - Whether to treat 422 as an error.
 */

import HttpError from './HttpError';

/**
 * @param {FetchOptions} options
 * @private
 */
function _validateOptions(options) {
  if (options.body && (options.json || options.form)) {
    throw new Error('Cannot use option "body" when the option "json" or "form" is used');
  }
}

/**
 * @param {string} urlString
 * @param {FetchOptions} options
 * @returns {string}
 * @private
 */
function _appendQueryString(urlString, options) {
  if (!options.query) {
    return urlString;
  }

  // Relative URLs detection
  if ('/' === urlString[0]) {
    urlString = location.origin + urlString;
  }

  const url = new URL(urlString);

  for (const [key, value] of Object.entries(options.query)) {
    if (undefined !== value && null !== value) {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(`${key}[]`, v.toString()));
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  }

  return url.toString();
}

function _getJson(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return null;
  }
}

/**
 * Execute a fetch call on the given URL and return a formatted Promise.
 *
 * @param {string} url
 * @param {FetchOptions} [options={}]
 * @returns {PromiseLike<{headers: Headers, json: any, body: string, status: number, statusText: string}|HttpError>}
 */
export const ajax = (url, options = {}) => {
  _validateOptions(options);

  const reqOptions = {};
  const requestHeaders = (options.headers || new Headers({ Accept: 'application/json' }));

  if (options.body) {
    reqOptions.body = options.body;
  }

  if (options.json) {
    reqOptions.body = JSON.stringify(options.json);
  }

  if (options.form) {
    const form = options.form;
    reqOptions.method = form.method;
    reqOptions.body = new FormData(form);
  }

  if (options.method) {
    reqOptions.method = options.method;
  }

  if (options.timeout) {
    reqOptions.signal = AbortSignal.timeout(options.timeout);
  }

  if (!requestHeaders.has('Content-Type') && !(options?.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!requestHeaders.has('X-Requested-With')) {
    requestHeaders.set('X-Requested-With', 'XMLHttpRequest');
  }

  url = _appendQueryString(url, options);

  return fetch(url, { ...reqOptions, headers: requestHeaders, ...options.rawOptions })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      })),
    )
    .then(({ status, statusText, headers, body }) => {
      const json = _getJson(body);

      if ((status < 200 || status >= 300) && (options.unprocessableEntityAsError || 422 !== status)) {
        return Promise.reject(
          new HttpError(
            (json && json.message) || statusText,
            status,
            json || body,
          ),
        );
      }

      return Promise.resolve({ status, statusText, headers, body, json });
    });
};
