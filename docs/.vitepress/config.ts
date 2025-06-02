import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue-Multi-DatePicker',
  description: 'A documentation for vue-multi-date-picker component',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    fr: {
      label: 'Persian',
      lang: 'fa',
      link: '/fa',

      // other locale specific properties...
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: 'documentation/overview' },
          { text: 'Installation', link: 'documentation/installation' },

          { text: 'Quick Start', link: 'documentation/quick-start' },
          { text: 'Date Object', link: 'documentation/date-object' },
          { text: 'Options(props)', link: 'documentation/datepicker-options' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
