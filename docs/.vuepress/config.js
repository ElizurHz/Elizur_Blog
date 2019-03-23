module.exports = {
  dest: 'La Vie en Code',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'La Vie en Code',
      description: `一个不善表达的闷骚前端的个人小空间`
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  themeConfig: {
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '前端',
            items: [
              { text: 'HTML/CSS', link: '/frontend/html-css/canvas-writing-pad' },
              // { text: 'JavaScript', link: '/frontend/javascript/rxjs-first-look' },
              { text: 'TypeScript', link: '/frontend/typescript/' },
              { text: 'React', link: '/frontend/react/react-debounce' },
              { text: '移动 H5 / 混合开发', link: '/frontend/mobile/mpvue-wx-mini-app-first-look' }
            ]
          },
          {
            text: '后端',
            items: [
              // { text: 'Node.js', link: '/backend/node/' },
              { text: '其他', link: '/backend/other/maven-tomcat-idea' }
              // { text: 'MongoDB', link: '/backend/mongodb/' }
            ]
          },
          // {
          //   text: 'AI',
          //   items: [
          //     { text: '机器学习', link: '/ai/machine-learning/' },
          //     { text: '数据挖掘', link: '/ai/data-mining/' },
          //   ]
          // },
          {
            text: '其他技术',
            link: '/other-tech/c-s-ops'
          },
          {
            text: '翻译',
            link: '/translation/'
          },
          {
            text: '杂记',
            link: '/life/my-2018'
          }
        ],
        sidebar: {
          '/frontend/react/': genReactSidebarConfig('React'),
          '/frontend/html-css/': genHTMLCSSSidebarConfig('HTML/CSS'),
          '/frontend/mobile/': genMobileSidebarConfig('移动 H5 / 混合开发'),
          '/frontend/typescript/': genTSSidebarConfig('TypeScript'),
          // '/frontend/javascript/': genJSSidebarConfig('JavaScript'),
          '/backend/other/': genOtherBackendSidebarConfig('后端其他'),
          '/other-tech/': genOtherTechSidebarConfig('其他技术'),
          '/translation/': genTranslationSidebarConfig('翻译'),
          '/life/': genLifeSidebarConfig('杂记')
        }
      }
    }
  }
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@static': 'path/to/some/dir'
  //     }
  //   }
  // }
}

function genReactSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'react-debounce'
      ]
    }
  ]
}

function genMobileSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'mpvue-wx-mini-app-first-look'
      ]
    }
  ]
}

function genHTMLCSSSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'canvas-writing-pad'
      ]
    }
  ]
}

function genTSSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'typescript-for-jser'
        // 'typescript-in-action'
      ]
    }
  ]
}

// function genJSSidebarConfig (title) {
//   return [
//     {
//       title,
//       collapsable: false,
//       children: [
//         'rxjs-first-look'
//       ]
//     }
//   ]
// }

function genOtherBackendSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'maven-tomcat-idea'
      ]
    }
  ]
}

function genOtherTechSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'c-s-ops',
        'docker-ops',
        'remote-private-git-first-look',
        'domain-and-website-approve',
        'git-upstream'
      ]
    }
  ]
}

function genTranslationSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        ''
      ]
    }
  ]
}

function genLifeSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'my-2018',
        'some-think-of-writing-blog'
      ]
    }
  ]
}
