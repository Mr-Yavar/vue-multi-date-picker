import { createRequire } from 'module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineAdditionalConfig({
  lang: 'fa-IR',
  description: 'ژنراتور استاتیک وب‌سایت با Vite و Vue',
  dir: 'rtl',

})
