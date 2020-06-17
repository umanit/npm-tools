/*********************************************************************************
 * Document ready
 *
 * If it is necessary to wait until the DOM has finished loading
 *
 * Usage:
 *    import { ready } from '@umanit/tools';
 *
 *    ready(() => console.log("DOM is ready!"));
 ********************************************************************************/

export const ready = callback => {
  if (
    document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)
  ) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};
