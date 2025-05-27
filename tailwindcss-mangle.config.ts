import { defineConfig } from 'tailwindcss-patch'

export default defineConfig({

    mangle: {
      classGenerator: {
        classPrefix: 'vuemultidatepicker-',
// include:["datepickers"]
      },
    },

  patch: {
    output: {
      filename: 'xxx.json',
      loose: true,
      removeUniversalSelector: false,
    },
    tailwindcss: {
      config: 'path/to/your-tailwind.config.js',
      cwd: 'project/cwd',
    },
  },
})
