---
layout: home

hero:
  name: eslint-plugin-feature-sliced
  text: ESLint плагин для Feature-Sliced Design
  tagline: Контролируйте архитектуру FSD в вашем проекте
  actions:
    - theme: brand
      text: Начать
      link: /ru/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/conarti/eslint-plugin-feature-sliced

features:
  - icon: 🏗️
    title: Импорты между слоями
    details: Проверяет импорты между слоями согласно иерархии FSD. Предотвращает импорт из верхних слоёв в нижние.
  - icon: 📁
    title: Абсолютные и относительные пути
    details: Обеспечивает правильный тип путей — относительные внутри слайсов, абсолютные между слоями.
  - icon: 📦
    title: Public API
    details: Требует импорты только из публичного API (index файлов), а не из внутренних файлов модулей.
  - icon: 📊
    title: Сортировка импортов
    details: Сортирует импорты по слоям FSD с помощью eslint-plugin-import-x.
---
