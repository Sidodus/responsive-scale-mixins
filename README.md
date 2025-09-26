# 🎨 Responsive Scale Mixins

A powerful SCSS mixin system for creating perfectly responsive designs that maintain Figma proportions across all screen sizes.

[![npm version](https://badge.fury.io/js/responsive-scale-mixins.svg)](https://badge.fury.io/js/responsive-scale-mixins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Figma Proportions**: Maintains exact proportions from your Figma designs
- **Automatic Scaling**: No manual breakpoint calculations needed
- **Tablet Interpolation**: Smart interpolation between mobile and desktop values
- **CSS Custom Properties**: Uses modern CSS variables for optimal performance
- **Framework Agnostic**: Works with any CSS framework or vanilla CSS
- **TypeScript Ready**: Compatible with CSS Modules and CSS-in-JS solutions

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
  --computed-scale-factor-px: calc(100vw / 1920);
  --computed-scale-factor-rem: calc(100vw / 1920 / 16);
  --computed-tablet-scale-factor-px: calc(100vw / 768);
  --computed-tablet-scale-factor-rem: calc(100vw / 768 / 16);
  --computed-mobile-scale-factor-px: calc(100vw / 390);
  --computed-mobile-scale-factor-rem: calc(100vw / 390 / 16);
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
  // Custom design widths (desktop, tablet, mobile)
  @include responsive-scale-variables(1440px, 768px, 375px);
}
```

**Default values:**

- Desktop: 1920px
- Tablet: 768px
- Mobile: 390px

### REM Units

```scss
.element {
  @include responsive-scale(font-size, 3, 2, rem); // 3rem / 2rem
}
```

### Manual CSS Variables (Alternative)

If you prefer manual control, you can set the CSS variables directly:

```scss
:root {
  --computed-scale-factor-px: calc(100vw / 1440); // Your desktop width
  --computed-scale-factor-rem: calc(100vw / 1440 / 16);
  --computed-tablet-scale-factor-px: calc(100vw / 768); // Your tablet width
  --computed-tablet-scale-factor-rem: calc(100vw / 768 / 16);
  --computed-mobile-scale-factor-px: calc(100vw / 375); // Your mobile width
  --computed-mobile-scale-factor-rem: calc(100vw / 375 / 16);
  --tablet-proportion-scale-factor: calc((100vw - 375px) / (1440px - 375px));
}
```

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

## 📞 Support

- 📧 Email: saheedodulaja@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Sidodus/responsive-scale-mixins/issues)
- 📖 Docs: [Full Documentation](https://github.com/Sidodus/responsive-scale-mixins#readme)

---

**Made with ❤️ by [Saheed Odulaja](https://github.com/Sidodus)**
