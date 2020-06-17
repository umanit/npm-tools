# @umanit/tools

[![npm (scoped)](https://img.shields.io/github/package-json/v/umanit/npm-tools?color=green)](https://www.npmjs.com/package/@umanit/tools)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@umanit/tools.svg)](https://www.npmjs.com/package/@umanit/tools)

Tools used by UmanIT during websites development.

- [Install](#install)
- [Available tools](#available-tools)
  * [breakpoints](#breakpoints)
  * [debounce](#debounce)
  * [document-ready](#document-ready)

## Install

```sh
$ # using npm
$ npm install @umanit/tools

$ # OR using yarn
$ yarn add @umanit/tools
```

## Available tools

### breakpoints
Test the current active responsive breakpoint.

Usage:
```js
import { breakpoints } from '@umanit/tools';

if (breakpoints.isDesktop()) {
  // ...
}

if (breakpoints.isTablet()) {
  // ...
}

if (breakpoints.isMobile()) {
  // ...
}
```

### debounce
Debounce the call to a function.

Usage:
```js
import { debounce } from '@umanit/tools';

function heavyScrollFunction () {
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
