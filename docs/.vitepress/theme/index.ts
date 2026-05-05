import Theme from 'vitepress/theme';
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import './style.css';

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app: _app, router: _router, siteData: _siteData }) {
    /* ... */
  },
};
