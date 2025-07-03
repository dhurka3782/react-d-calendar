# Changelog
All notable changes to `react-d-calendar` will be documented in this file.
## [1.1.0] - 2025-07-03
### Added

- Support for `light`, `dark`, and `system` themes via the `theme` prop.
- Dynamic theme switching based on system `prefers-color-scheme` for `theme="system"`.
- Updated CSS with variables for consistent theming across light and dark modes.
- Tests for theme switching functionality to ensure reliability.
Documentation for theme support in `README.md`.

### Changed

- Updated `styles.css` to use CSS variables for all color-related properties, enhancing maintainability.
- Incremented package version to `1.1.0` to reflect the new theme feature.
