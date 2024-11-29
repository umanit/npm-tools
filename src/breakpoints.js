/*********************************************************************************
 * Manage breakpoints
 *
 * Usage :
 *    import { breakpoints } from '@umanit/tools';
 *
 *    if (breakpoints.isMobile) { ... }
 *    if (breakpoints.isTablet) { ... }
 *    if (breakpoints.isDesktop) { ... }
 ********************************************************************************/

const breakpointsBounds = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
};

const isMobile = () => window.innerWidth < breakpointsBounds.sm;
const isTablet = () => window.innerWidth > breakpointsBounds.sm && window.innerWidth < breakpointsBounds.md;
const isDesktop = () => window.innerWidth >= breakpointsBounds.md;

export const breakpoints = { isMobile, isTablet, isDesktop };

export const mediaQueries = {
  mobile: `(max-width: ${breakpointsBounds.sm}px)`,
  tablet: `(min-width: ${breakpointsBounds.sm}px) and (max-width: ${breakpointsBounds.md}px)`,
  desktop: `(min-width: ${breakpointsBounds.md}px)`,
};
