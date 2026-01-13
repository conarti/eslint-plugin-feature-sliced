---
layout: home

hero:
  name: eslint-plugin-feature-sliced
  text: ESLint plugin for Feature-Sliced Design
  tagline: Enforce FSD architecture rules in your codebase
  actions:
    - theme: brand
      text: Get Started
      link: /en/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/conarti/eslint-plugin-feature-sliced

features:
  - icon: 🏗️
    title: Layer Imports
    details: Validates imports between layers according to FSD hierarchy. Prevents importing from higher layers into lower ones.
  - icon: 📁
    title: Absolute & Relative Paths
    details: Ensures correct path types - relative within slices, absolute between layers.
  - icon: 📦
    title: Public API
    details: Enforces imports only from public API (index files), not from internal module files.
  - icon: 📊
    title: Import Sorting
    details: Sorts imports by FSD layers using eslint-plugin-import-x integration.
---
