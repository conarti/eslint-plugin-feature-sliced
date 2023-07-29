---
title: Advanced configuration
outline: deep
---

# Advanced configuration

If you followed the [Quick install](/quick-install) steps, your config now looks something like this:

```json
{
  "env": {
    ...
  },
  "parserOptions": {
    ...
  },
  "extends": [  // [!code focus:3]
    "plugin:@conarti/feature-sliced/recommended"
  ],
  "rules": {
    ...
  }
}
```

Further customization of the plugin depends on your needs:
1. If you like the recommended settings, but still need to tweak some rules for yourself, follow the step [below](#customization-of-the-recommended-config).
2. If you have a specific project or just want to set everything up yourself, then skip the next step and start from [Setup plugin rules](#setup-plugin-rules).

## Customization of the `recommended` config

Leave the use of this config only if you want to _**overwrite**_ the settings of some rules.

### Using multiple configurations together

When using this scenario, note that in the `extends` field it is important in which order the configurations are used.
For example, with this setting, rules declared in `config-B` will take precedence and overwrite rules in `config-A`.
Only _**overlapping**_ rules, the rest will be merged.

```json
{
  "extends": [
    "config-A",
    "config-B"
  ]
}
```

### Overwrite specific configuration rules

You can overwrite the settings of certain rules from ready-made configurations in the same way as `extends`.
Only in this case the settings from the `rules` field will take priority over `extends`.

For example, if you want a specific rule to display a warning instead of an error:
```json
{
  "extends": [
    "plugin:@conarti/feature-sliced/recommended" // contain 'import/order': ['error', { ... }]
  ],
  "rules": {
    "import/order": "warn" // now will throw warning instead. Other rule settings remain untouched
  }
}
```

::: info
You can see the content of the recommended config on [GitHub](https://github.com/conarti/eslint-plugin-feature-sliced/blob/master/src/configs/recommended.ts)
:::

## Setup plugin rules

// TODO
