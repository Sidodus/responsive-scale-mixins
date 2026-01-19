# 🎨 Responsive Scale Mixins

A powerful SCSS mixin system for creating perfectly responsive designs that maintain Figma proportions across all screen sizes.

[![npm version](https://badge.fury.io/js/responsive-scale-mixins.svg)](https://www.npmjs.com/package/responsive-scale-mixins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/responsive-scale-mixins)](https://www.npmjs.com/package/responsive-scale-mixins)
[![npm](https://img.shields.io/npm/dm/responsive-scale-mixins)](https://www.npmjs.com/package/responsive-scale-mixins)

## ⚠️ Breaking Changes in v2.0.0

**Pure CSS implementations are affected by this breaking change.**

- **CSS Variables**: Variable names changed from `--computed-scale-factor-px`/`--computed-scale-factor-rem` to generic `--computed-scale-factor`
- **Calc Expressions**: Units are now appended to multipliers (e.g., `* 2rem` instead of `* 2`)
- **SCSS Usage**: Unchanged - existing SCSS mixin calls continue to work

**SCSS implementations are NOT affected** - existing `@include responsive-scale()` calls work unchanged.

### Migration Guide (Pure CSS Users)

**Update your CSS variable definitions:**

```css
/* OLD (v1.x) */
:root {
  --computed-scale-factor-px: calc(100vw / 1440);
  --computed-scale-factor-rem: calc(100vw / 1440 / 16);
  --computed-tablet-scale-factor-px: calc(100vw / 768);
  --computed-tablet-scale-factor-rem: calc(100vw / 768 / 16);
  --computed-mobile-scale-factor-px: calc(100vw / 375);
  --computed-mobile-scale-factor-rem: calc(100vw / 375 / 16);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

/* NEW (v2.0) */
:root {
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}
```

**Update your calc expressions to include units:**

```css
/* OLD (v1.x) */
font-size: calc(var(--computed-scale-factor-px) * 40);

/* NEW (v2.0) */
font-size: calc(var(--computed-scale-factor) * 40px);
```

## ✨ Features

- **Figma Proportions**: Maintains exact proportions from your Figma designs
- **Automatic Scaling**: No manual breakpoint calculations needed
- **Tablet Interpolation**: Smart interpolation between mobile and desktop values
- **CSS Custom Properties**: Uses modern CSS variables for optimal performance
- **Framework Agnostic**: Works with any CSS framework or vanilla CSS
- **TypeScript Ready**: Compatible with CSS Modules and CSS-in-JS solutions
- **Universal Unit Support**: Handles all CSS units including absolute (px, pt, cm, mm, in, pc) and relative (%, em, rem, vw, vh, vmin, vmax) units

## 🔧 Dart Sass Compatibility

**Starting with v2.0.4**, this package is fully compatible with Dart Sass. The `index.scss` file now uses relative `@forward` statements (`./scss/variables` and `./scss/mixins`) to ensure proper resolution in Dart Sass environments like Next.js, Vite, and other modern build tools.

### Recommended Import Pattern

```scss
// Modern @use syntax (preferred)
@use "responsive-scale-mixins" as rsm;

:root {
  @include rsm.responsive-scale-variables();
}

.my-element {
  @include rsm.responsive-scale(font-size, 24, 16);
}
```

### Troubleshooting Import Errors

If you encounter "Can't find stylesheet to import" errors with Dart Sass:

1. **Update the package**: Ensure you're using v2.0.4 or later
2. **Use relative imports as workaround**: Import the partials directly:
   ```scss
   @import "responsive-scale-mixins/scss/variables";
   @import "responsive-scale-mixins/scss/mixins";
   ```
3. **Check your build tool**: Some tools may need configuration updates for SCSS module resolution

## 🚀 Quick Start

### Installation

#### npm

```bash
npm install responsive-scale-mixins
```

#### Yarn

```bash
yarn add responsive-scale-mixins
```

#### pnpm

```bash
pnpm add responsive-scale-mixins
```

### Framework-Specific Setup

#### Next.js (App Router)

```scss
// app/globals.css or app/styles/globals.scss
@import "~responsive-scale-mixins";

:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  // Define CSS variables globally (required)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}

// Import in app/layout.tsx: import './globals.css'
```

#### Next.js (Pages Router)

```scss
// styles/globals.scss
@import "~responsive-scale-mixins";

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}

// Import in pages/_app.js: import '../styles/globals.scss'
```

**Next.js Setup:**

- **App Router**: Put `:root` in `app/globals.css` (imported in `layout.tsx`)
- **Pages Router**: Put `:root` in `styles/globals.scss` (imported in `pages/_app.js`)
- The `:root` selector defines global CSS custom properties accessible everywhere

#### Create React App

```scss
// src/index.scss or src/styles/main.scss
@import "~responsive-scale-mixins";

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}

// Import in src/index.js: import './index.scss'
```

**Create React App Setup:**

- Put `:root` in your main SCSS file (e.g., `src/index.scss`)
- Import the SCSS file in `src/index.js`
- The `:root` selector makes CSS variables available app-wide

#### Vue.js

```scss
// src/assets/styles/main.scss
@import "~responsive-scale-mixins";

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}

// Import in src/main.js: import './assets/styles/main.scss'
```

**Vue.js Setup:**

- Put `:root` in your global SCSS file
- Import in `src/main.js` or use in a global style resource
- The `:root` selector defines app-wide CSS variables

#### Angular

```scss
// src/styles.scss (global styles)
@import "~responsive-scale-mixins";

:root {
  // Define CSS variables globally (required)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}

// This file is automatically included by Angular CLI
```

**Angular Setup:**

- Put `:root` in `src/styles.scss` (automatically included by Angular CLI)
- No manual import needed - Angular handles it
- The `:root` selector defines global CSS variables

#### Vite + Vue/React

```scss
// src/styles/main.scss
@import "responsive-scale-mixins";

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}
```

#### Gatsby

```scss
// src/styles/global.scss
@import "~responsive-scale-mixins";

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}
```

#### Nuxt.js

```scss
// assets/styles/main.scss
@import "~responsive-scale-mixins";

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}
```

#### SvelteKit

```scss
// src/app.scss
@import "responsive-scale-mixins";

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}
```

#### Astro

```scss
// src/styles/global.scss
@import "responsive-scale-mixins";

:root {
  // Customize for your design system (optional)

  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}
```

#### CSS Modules

```scss
// styles.module.scss
@import "~responsive-scale-mixins";

// Variables must be in global scope
// In your main CSS file:
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1920);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 390);
  --tablet-proportion-scale-factor: calc((100vw - 390px) / (1920px - 390px));
}

// Then in your module
.myClass {
  @include responsive-scale(font-size, 24, 16);
}
```

#### Tailwind CSS Integration

```scss
// styles/main.scss
@import "~responsive-scale-mixins";

:root {
  @include responsive-scale-variables();
}

// Use alongside Tailwind
.custom-element {
  @include responsive-scale(padding, 20 40, 10 20);
  @apply bg-blue-500 text-white; // Tailwind classes still work
}
```

#### Styled Components

```scss
// If using styled-components with SCSS preprocessing
import styled from 'styled-components';
import './styles/responsive-mixins.scss'; // Import in your main file

const StyledComponent = styled.div`
  ${props => props.theme.responsiveScale('font-size', 24, 16)}
`;
```

### Basic Usage

#### Modern @use Syntax (Recommended)

```scss
// In your main SCSS file
@use "responsive-scale-mixins" as rsm;

// Include variables in your root element (required)
:root {
  @include rsm.responsive-scale-variables();
}

// Use the mixin anywhere
.my-element {
  @include rsm.responsive-scale(font-size, 24, 16);
  @include rsm.responsive-scale(padding, 20 40, 10 20);
}
```

#### Legacy @import Syntax (for older setups)

```scss
// In your main SCSS file
@import "~responsive-scale-mixins";

// Include variables in your root element (required)
:root {
  @include responsive-scale-variables();
}

// Use the mixin anywhere
.my-element {
  @include responsive-scale(font-size, 24, 16);
  @include responsive-scale(padding, 20 40, 10 20);
}
```

## 📖 API Reference

### `responsive-scale-variables($desktop-width, $tablet-width, $mobile-width)`

Defines the CSS custom properties for scaling calculations.

**Parameters:**

- `$desktop-width`: Design width for desktop (default: 1920px)
- `$tablet-width`: Design width for tablet (default: 768px)
- `$mobile-width`: Design width for mobile (default: 390px)

### `responsive-scale($property, $desktop-value, $mobile-value, $unit, $is-percentage, $desktop-relative, $mobile-relative, $important)`

The main responsive scaling mixin.

**Parameters:**

- `$property`: CSS property name (e.g., `font-size`, `padding`)
- `$desktop-value`: Value for desktop screens
- `$mobile-value`: Value for mobile screens
- `$unit`: Unit for scaling (`px` or `rem`, default: `px`)
- `$is-percentage`: Whether the value is a percentage (default: `false`)
- `$desktop-relative`: Base value for percentage calculations on desktop
- `$mobile-relative`: Base value for percentage calculations on mobile
- `$important`: String to append (e.g., `" !important"` for override, default: `null`)

## 🎯 Examples

### Typography

```scss
.hero-title {
  @include responsive-scale(font-size, 48, 32);
  @include responsive-scale(line-height, 1.2, 1.3);
  @include responsive-scale(letter-spacing, -1, -0.5);
}
```

### Spacing

```scss
.card {
  @include responsive-scale(padding, 32 48, 16 24);
  @include responsive-scale(margin-bottom, 24, 16);
}
```

### Dimensions

```scss
.button {
  @include responsive-scale(width, 200, 150);
  @include responsive-scale(height, 56, 44);
  @include responsive-scale(border-radius, 8, 6);
}
```

### Percentage-based Properties

```scss
.text {
  // Letter-spacing as 1% of font-size
  @include responsive-scale(letter-spacing, 1, 1, px, true, 48, 32);
}
```

### Override Specificity

```scss
.override-bootstrap {
  @include responsive-scale(
    font-size,
    24,
    16,
    px,
    false,
    null,
    null,
    " !important"
  );
  @include responsive-scale(
    padding,
    16 32,
    8 16,
    px,
    false,
    null,
    null,
    " !important"
  );
}
```

## 🔧 Configuration

### Custom Design Widths

Easily customize the design widths to match your project's breakpoints:

```scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)

  // Custom design widths (desktop, tablet, mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
  // Or use defaults: @include responsive-scale-variables();
}
```

**Default values:**

- Desktop: 1920px
- Tablet: 768px
- Mobile: 390px

### REM and EM Units

```scss
.element {
  @include responsive-scale(
    font-size,
    3,
    2,
    rem
  ); // 3rem / 2rem - uses rem scale factor
  @include responsive-scale(
    font-size,
    2,
    1.5,
    em
  ); // 2em / 1.5em - uses rem scale factor
}
```

**Universal Unit Support:**

The mixin supports **all CSS units** with a single generic scale factor:

**Absolute Units:**

- `@include responsive-scale(property, value, mobile-value, px)` → `* valuepx`
- `@include responsive-scale(property, value, mobile-value, pt)` → `* valuept`
- `@include responsive-scale(property, value, mobile-value, cm)` → `* valuecm`
- `@include responsive-scale(property, value, mobile-value, mm)` → `* valuemm`
- `@include responsive-scale(property, value, mobile-value, in)` → `* valuein`
- `@include responsive-scale(property, value, mobile-value, pc)` → `* valuepc`

**Relative Units:**

- `@include responsive-scale(property, value, mobile-value, em)` → `* valueem`
- `@include responsive-scale(property, value, mobile-value, rem)` → `* valuerem`
- `@include responsive-scale(property, value, mobile-value, %)` → `* value%`
- `@include responsive-scale(property, value, mobile-value, vw)` → `* valuevw`
- `@include responsive-scale(property, value, mobile-value, vh)` → `* valuevh`
- `@include responsive-scale(property, value, mobile-value, vmin)` → `* valuevmin`
- `@include responsive-scale(property, value, mobile-value, vmax)` → `* valuevmax`

**Example Usage:**

```scss
.element {
  @include responsive-scale(margin, 2, 1, cm); // centimeters
  @include responsive-scale(width, 50, 30, vw); // viewport width
  @include responsive-scale(height, 80, 60, vh); // viewport height
  @include responsive-scale(font-size, 1.5, 1, em); // em units
}
```

### Manual CSS Variables (Alternative)

If you prefer manual control, you can set the CSS variables directly:

```scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440); // Your desktop width
  --computed-tablet-scale-factor: calc(100vw / 768); // Your tablet width
  --computed-mobile-scale-factor: calc(100vw / 375); // Your mobile width
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}
```

## 🔧 Troubleshooting

If the `@include responsive-scale-variables()` mixin doesn't work in your setup (e.g., due to SCSS compilation issues), use the manual CSS variables approach. Below are manual setups for each framework:

### Why the Manual Approach Works

The `@include responsive-scale-variables()` mixin may fail in certain SCSS compilation environments (like some Next.js setups) because the imported mixins aren't processed correctly. The manual CSS variables approach bypasses this by directly defining the required `--computed-scale-factor-*` variables in `:root`.

### Next.js (App Router) - Manual Setup

```scss
// app/globals.css or app/styles/globals.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440); // Your design desktop width
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component files
@import "responsive-scale-mixins";
.my-element {
  @include responsive-scale(font-size, 24, 16);
}
```

### Next.js (Pages Router) - Manual Setup

```scss
// styles/globals.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component files
@import "responsive-scale-mixins";
```

### Create React App - Manual Setup

```scss
// src/index.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component files
@import "responsive-scale-mixins";
```

### Vue.js - Manual Setup

```scss
// src/assets/styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component styles
@import "responsive-scale-mixins";
```

### Angular - Manual Setup

```scss
// src/styles.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In component styles
@import "responsive-scale-mixins";
```

### Vite + Vue/React - Manual Setup

```scss
// src/styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### Gatsby - Manual Setup

```scss
// src/styles/global.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### Nuxt.js - Manual Setup

```scss
// assets/styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### SvelteKit - Manual Setup

```scss
// src/app.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### Astro - Manual Setup

```scss
// src/styles/global.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
```

### CSS Modules - Manual Setup

```scss
// In your global CSS file (e.g., globals.scss)
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1920);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 390);
  --tablet-proportion-scale-factor: calc((100vw - 390px) / (1920px - 390px));
}

// In your module files
@import "responsive-scale-mixins";
.myClass {
  @include responsive-scale(font-size, 24, 16);
}
```

### Tailwind CSS - Manual Setup

```scss
// styles/main.scss
:root {
  // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In components
@import "responsive-scale-mixins";
.custom-element {
  @include responsive-scale(padding, 20 40, 10 20);
  @apply bg-blue-500 text-white;
}
```

### Styled Components - Manual Setup

```scss
// In your global styles
:root {
   // Replace 1440 with your design width or leave default (desktop)
  // Replace 768 with your design width or leave default (tablet)
  // Replace 375 with your design width or leave default (mobile)
  --computed-scale-factor: calc(100vw / 1440);
  --computed-tablet-scale-factor: calc(100vw / 768);
  --computed-mobile-scale-factor: calc(100vw / 375);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}

// In styled components with SCSS preprocessing
import styled from 'styled-components';
import './styles/responsive-mixins.scss';

const StyledComponent = styled.div`
  ${props => props.theme.responsiveScale('font-size', 24, 16)}
`;
```

**Note:** Replace `1440`, `768`, `375` with your actual design widths. The manual approach ensures compatibility across all build tools and frameworks.

## 📱 Breakpoints

- **Desktop**: ≥992px (scales from desktop design width)
- **Tablet**: 768px - 991px (interpolated values)
- **Mobile**: ≤767px (scales from mobile design width)

## 🛠 Development

### Building

```bash
npm install
# No build step required - pure SCSS
```

### Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Figma's responsive design principles
- Built for modern web development workflows
- Compatible with CSS Modules, Styled Components, and traditional CSS

## 🧪 Testing

The library includes a comprehensive test suite located in the `test/` directory:

```bash
# Run the test suite
cd test && ./test.sh  # Unix/Linux/macOS
cd test && test.bat   # Windows
```

See [`test/TEST_README.md`](test/TEST_README.md) for detailed testing instructions.

<!-- ## � Linking NPM Package to GitHub Packages

To connect your published NPM package to GitHub Packages:

1. **Go to your GitHub repository** → **Settings** → **Packages**
2. **Click "Connect repository"** or **"Link to repository"**
3. **Search for and select** your NPM package: `responsive-scale-mixins`
4. **Confirm the connection**

This will display your NPM package statistics and information in the GitHub Packages section of your repository.

**Note:** The package will automatically appear in GitHub Packages once published to NPM, as long as the repository URL in `package.json` matches your GitHub repository. -->

## �📞 Support

- 📧 Email: saheedodulaja@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Sidodus/responsive-scale-mixins/issues)
- 📖 Docs: [Full Documentation](https://github.com/Sidodus/responsive-scale-mixins#readme)
- 📦 NPM: [https://www.npmjs.com/package/responsive-scale-mixins](https://www.npmjs.com/package/responsive-scale-mixins)
- 👤 NPM Profile: [https://www.npmjs.com/~sidodus](https://www.npmjs.com/~sidodus)

---

**Made with ❤️ by [Saheed Odulaja](https://github.com/Sidodus)**
