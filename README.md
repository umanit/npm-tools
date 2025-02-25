# @umanit/tools

[![npm (scoped)](https://img.shields.io/github/package-json/v/umanit/npm-tools?color=green)](https://www.npmjs.com/package/@umanit/tools)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@umanit/tools.svg)](https://www.npmjs.com/package/@umanit/tools)

Tools used by UmanIT during websites development.

- [Install](#install)
- [Available tools](#available-tools)
    * [breakpoints](#breakpoints)
    * [debounce](#debounce)
    * [document-ready](#document-ready)
    * [fetch-utils](#fetch-utils)

## Install

```sh
$ # using npm
$ npm install @umanit/tools

$ # OR using yarn
$ yarn add @umanit/tools
```

## Available tools

### breakpoints

Test the current active responsive breakpoint or get them as media query strings.

Usage:

```js
import { breakpoints, mediaQueries } from '@umanit/tools';

if (breakpoints.isDesktop()) {
  // ...
}

if (breakpoints.isTablet()) {
  // ...
}

if (breakpoints.isMobile()) {
  // ...
}

console.log(mediaQueries.mobile); // (max-width: 768px)
console.log(mediaQueries.tablet); // (min-width: 768px) and (max-width: 992px)
console.log(mediaQueries.desktop); // (min-width: 992px)
```

### debounce

Debounce the call to a function.

Usage:

```js
import { debounce } from '@umanit/tools';

function heavyScrollFunction() {
  // doing some heavy stuffs during scroll...
}

window.addEventListener("scroll", debounce(heavyScrollFunction));
```

### document-ready

Waits for the DOM before executing a function.

Usage:

```js
import { ready } from '@umanit/tools';

ready(() => console.log('The DOM is ready now!'));
```

### fetch-utils

#### Description

Facilitates manipulation of `fetch`.

The first argument is the URL to call, and the second an object of options to prepare the call.

Returns a `Promise` with the following data when success:

* `headers` - The `Headers` object of the response.
* `status` - The status code of the response.
* `statusText` - The status text of the response.
* `json` - The parsed JSON of the response or `null` if the response was not a JSON (or if the parsing fail).
* `body` - The body of the response.

Or a `HttpError` object when an error occurred which contains:

* `message` - The message of the error
* `status` - The status of the response
* `body` - The body of the response
* `stack` - The stack trace of the error

#### Options

* `body` - The body to send.
* `form` - A `HTMLFormElement` to send. If present, it will be transformed into a `FormData` in the request `body` and
  it’s method will be automatically used.
* `headers` - An object `Headers` for the request.
* `json` - A JSON object to send. If present, it will be `JSON.stringify` in the request `body`.
* `method` - The HTTP method to use.
* `query` - Hash of values used to append a query string to the URL.
* `rawOptions` - Additional raw options passed to `fetch`.
* `timeout` - A timeout (in milliseconds) for the request execution
  (cf. https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
* `unprocessableEntityAsError` (default `false`) - A boolean which indicates if HTTP Status 422 should be considered as
  an error or not.

#### Usage

```js
import { ajax } from '@umanit/tools';

// Given a form
const form = document.querySelector('#my-form');

ajax('https://my-site.com/ajax.html', { form })
  .then(({ body }) => alert(body))
  .catch(err => console.error(err));

// Given a JSON
ajax('https://my-site.com/ajax.html', {
  headers: new Headers({ 'X-API-KEY': 'HelloW0rld!' }),
  json: {
    key1: 'valueA',
    key2: ['value', 'B'],
  },
  method: 'get'
})
  .then(({ json }) => {
    // Use the JSON of the response...
    console.log(json);
  })
  .catch(err => console.error(err));
```
