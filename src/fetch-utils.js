/*********************************************************************************
 * Facilitate fetch usage
 *
 * Usage : see README.md
 ********************************************************************************/

import HttpError from './HttpError';

function _isIterable(obj) {
  // checks for null and undefined
  if (null == obj) {
    return false;
  }

  return typeof obj[Symbol.iterator] === 'function';
}

function _appendQueryString(urlString, options) {
  if (!options.query) {
    return urlString;
  }

  // Relative URLs detection
  if ('/' === urlString[0]) {
    urlString = location.origin + urlString;
  }

  const url = new URL(urlString);

  if (_isIterable(options.query)) {
    for (const [key, value] of options.query) {
      if (undefined !== value) {
        url.searchParams.append(key, value);
      }
    }
  } else {
    const keys = Object.keys(options.query);

    Object.values(options.query).forEach((value, key) => {
      if (undefined !== value) {
        url.searchParams.append(keys[key], value);
      }
    });
  }

  delete options.query;

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
 * @param {Object} options
 * @param {null|Headers=} options.headers
 * @param {null|string=} options.json
 * @param {null|HTMLFormElement=} options.form
 * @param {null|string=} options.method
 * @param {boolean=true} options.unprocessableEntityAsError
 * @param {any} options.body
 * @returns {PromiseLike<{headers: Headers, json: any, body: string, status: number}>}
 */
export const ajax = (url, options = {}) => {
  const requestHeaders = (options.headers || new Headers({ Accept: 'application/json' }));

  if (options.json) {
    options.body = JSON.stringify(options.json);
    delete options.json;
  }

  if (options.form) {
    const form = options.form;
    options.method = form.method;
    options.body = new FormData(form);
    delete options.form;
  }

  if (
    !requestHeaders.has('Content-Type') &&
    !(options && options.body && options.body instanceof FormData)
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!requestHeaders.has('X-Requested-With')) {
    requestHeaders.set('X-Requested-With', 'XMLHttpRequest');
  }

  url = _appendQueryString(url, options);

  return fetch(url, { ...options, headers: requestHeaders })
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

      return Promise.resolve({ status, headers, body, json });
    });
};
