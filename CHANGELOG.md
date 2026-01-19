# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.4] - 2024-01-XX

### Added

- Added `"sass": "index.scss"` field to package.json for better Sass-aware tooling support
- Added Dart Sass Compatibility section to README
- Added troubleshooting section for import errors
- Added CHANGELOG.md

### Fixed

- Fixed Sass import errors in Dart Sass environments (Next.js, Vite, etc.) by using relative `@forward` paths
- Updated README to consistently use `rsm` namespace for @use syntax examples
- Updated all framework-specific setup examples to use modern @use syntax with `rsm` prefix

### Changed

- Updated index.scss to use relative paths: `@forward "./scss/variables";` and `@forward "./scss/mixins";`
- Updated all README examples to prefer @use syntax over @import
- Updated version to 2.0.4

## [2.0.3] - 2024-01-XX

### Fixed

- Minor bug fixes and documentation updates

## [2.0.2] - 2023-XX-XX

### Fixed

- Fixed CSS custom property naming issues
- Updated migration guide

## [2.0.1] - 2023-XX-XX

### Fixed

- Fixed calc expression units appending

## [2.0.0] - 2023-XX-XX

### Breaking Changes

- **CSS Variables**: Changed variable names from `--computed-scale-factor-px`/`--computed-scale-factor-rem` to generic `--computed-scale-factor`
- **Calc Expressions**: Units are now appended to multipliers (e.g., `* 2rem` instead of `* 2`)

### Added

- Support for all CSS units (px, rem, em, vw, vh, %, etc.)
- Universal unit support with single scale factor
- Improved documentation with framework-specific examples

### Changed

- Enhanced mixin flexibility for different unit types
- Updated API to support percentage-based calculations

## [1.x.x] - 2023-XX-XX

### Added

- Initial release with responsive scaling mixins
- Basic support for px and rem units
- Tablet interpolation functionality
- CSS custom properties support

[2.0.4]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/Sidodus/responsive-scale-mixins/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Sidodus/responsive-scale-mixins/compare/v1.x.x...v2.0.0
