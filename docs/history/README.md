# Historical Design Documents (archived)

These documents were produced during the v2.1.x–v2.2.x "browser
compatibility" work (archived from the former `fix/` folder in v2.3.0).

⚠️ **They are historical reference material only.** Several claims in them
are outdated or were later found to be incorrect — most notably:

- The v2.1.0–v2.2.0 fallback architecture emitted `calc()` expressions with
  division by a length (`100vw / 1920px`), which is unsupported in browsers
  before 2023 **and** is mangled into invalid CSS by current Dart Sass
  versions. v2.3.0 replaced that strategy (pure vw lengths + verbatim
  same-type-division forms + plain fallback pairs, no `@supports`).
- The tablet interpolation formula described throughout these documents was
  mathematically broken (inflated mid-range values, discontinuities at the
  breakpoint boundaries). v2.3.0 fixed the curve.
- The "breakpoints are hardcoded" problem these docs respond to was only
  fully solved by moving widths to Sass module configuration
  (`@use ... with (...)`) in v2.3.0.

For current behavior, read the package header in [`index.scss`](../../index.scss),
the main [README](../../README.md) and [AGENTS.md](../../AGENTS.md).
