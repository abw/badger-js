import { defineConfig } from 'vitepress'

const menuItems = [
  { text: 'Getting Started', link: '/getting-started' },
  { text: 'Filesystem Utilities', link: '/filesystem' },
  { text: 'Data Codecs', link: '/codecs' },
  { text: 'Configuration Files', link: '/config-files' },
  { text: 'Library Modules', link: '/library-modules' },
  { text: 'Data Paths', link: '/data-paths' },
  { text: 'Workspace', link: '/workspace' },
  { text: 'User Input', link: '/user-input' },
  { text: 'Project Setup', link: '/setup' },
  { text: 'Colors', link: '/colors' },
  { text: 'Debugging', link: '/debugging' },
  { text: 'Quitting', link: '/quitting' },
  { text: 'Progress', link: '/progress' },
  { text: 'Watch', link: '/watch' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Badger JS",
  description: "Javascript Project Toolkit",
  head: [['link', { rel: 'icon', href: '/badger-js/images/badger3.svg' }]],
  base: '/badger-js/',
  outDir: '../docs',
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'Badger JS',
    logo: '/images/badger3.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Documentation',
        items: menuItems,
      }
    ],
    sidebar: menuItems,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/abw/badger-js' }
    ],
    footer: {
      message: 'Built by Badgers',
      copyright: '©️ Andy Wardley 2022-2024'
    }
  }
})
