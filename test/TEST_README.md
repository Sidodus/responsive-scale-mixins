# Testing Guide

There are two layers of testing in this repository:

1. **The assertion suite** (`npm test`) - compiles representative stylesheets
   through the Dart Sass JS API and asserts on the generated CSS. This is the
   primary gate; CI runs it on every push/PR.
2. **The manual visual test page** (`test.sh` / `test.html`) - for eyeballing
   real browser rendering across viewport sizes.

## Automated Suite

```bash
npm test
# or: node test/run-tests.js
```

What it covers (41 assertions):

- Default breakpoints are derived from the module defaults (390px / 1919px / 389px)
- `@use ... with (...)` configuration drives calc expressions AND breakpoints
- The wrapper-file pattern propagates widths into separately compiled stylesheets
- Interpolation continuity at the breakpoint boundaries (numeric verification)
- Mid-range values are not inflated (1366px laptop ≈ 39.3px for a 48px design)
- Fluid declarations are @supports-wrapped (minifier barrier) and the output
  is var()-free with no division-by-length
- Fallback pairs, no-fallback mixin, global fallback disable, and the
  minifier-barrier invariant (no duplicate properties in plain rules)
- additionalData injection pattern (Next.js/Vite) incl. double-config error
- v2.4: clamp() bounds (two-sided/one-sided, all units, lists) and the
  breakpoint-map configuration incl. conflict validation
- Unit handling: px→vw, rem/em/vw/vh unit-preserving forms, cm conversion, negatives
- List values per-element + clear errors for mismatched lists
- Percentage mode (static desktop/mobile, interpolated tablet)
- Validation errors (unitless values, px widths, inverted widths)
- Legacy `@import` + variables-before-import pattern
- `responsive-scale-variables()` output and `breakpoint()` helper
- Zero deprecation warnings from current Dart Sass

## Manual Visual Testing

```bash
# Cross-platform
test/test.sh
```

This compiles `test.scss` → `test.css` and opens `test.html` in your browser.

Manual steps if `sass` is not installed globally:

```bash
npx --yes sass test/test.scss test/test.css
# then open test/test.html manually
```

### What to verify in the browser

Resize the window across the default breakpoints
(desktop design width 1920px, mobile design width 390px):

- **Mobile (≤389px)**: proportional scaling around the mobile design value
- **Tablet (390px-1919px)**: continuous interpolation between mobile and
  desktop values - no jumps at 390px or 1920px, values in between are
  *between* the two design values (never larger than the desktop value)
- **Desktop (≥1920px)**: proportional scaling around the desktop design value

Use DevTools → Computed tab to confirm exact sizes at the boundary widths.

### Expected output shapes

```css
/* px values: static fallback + @supports-wrapped pure vw fluid value
   (the @supports wrapper is a CSS-minifier barrier - see AGENTS.md) */
font-size: 48px;

@supports (font-size: 2.5vw) {
  font-size: 2.5vw;
}

/* tablet: continuous interpolation (unitless divisor - valid everywhere) */
@media screen and (min-width: 390px) and (max-width: 1919px) {
  font-size: 24px;

  @supports (font-size: calc(24px + (100vw - 390px) * 24 / 1530)) {
    font-size: calc(24px + (100vw - 390px) * 24 / 1530);
  }
}

/* unit-preserving values (rem/em/%/vw/vh): verbatim same-type division,
   division-first so CSS minifiers cannot reorder it into invalid CSS */
font-size: 3rem;

@supports (font-size: calc(3rem / 1920px * 100vw)) {
  font-size: calc(3rem / 1920px * 100vw);
}
```

## Test Files

```
test/
├── run-tests.js        # assertion suite (npm test)
├── test.scss           # visual test page styles
├── test.html           # visual test page
├── regression.scss     # regression case from v2.2.x era
├── fallback-test.scss  # fallback demo case
└── test.sh             # convenience script for the visual page
```

## Contributing to Tests

When changing output-affecting code in `index.scss`:

1. Run `npm test` - add assertions for any new behavior
2. Recompile `test.scss`/`regression.scss` and inspect the CSS
3. Check the banned patterns are absent: `var(`, `@supports`, `)px`,
   division by a length
4. Verify visually in a browser across the breakpoint boundaries
