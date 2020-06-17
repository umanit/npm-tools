/*********************************************************************************
 * Debounce
 *
 * Performance: limits calls to a given function
 *
 * Usage:
 *    import { debounce } from '@umanit/tools;
 *
 *    window.addEventListener("scroll", debounce(heavyFunction));
 ********************************************************************************/

export const debounce = (func, wait = 20, immediate = true) => {
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
};
