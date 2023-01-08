import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import { hydrate } from '@tanstack/vue-query'

export const clientRouting = true
export const prefetchStaticAssets = { when: 'VIEWPORT' }
export { render }
export { onHydrationEnd }
export { onPageTransitionStart }
export { onPageTransitionEnd }

let app: ReturnType<typeof createApp>
async function render(pageContext: PageContextBuiltInClient & PageContext) {
  if (!app) {
    const params = createApp(pageContext)
    app = params.app
    const queryClient = params.queryClient
    if (pageContext.pageProps != undefined) {
      hydrate(queryClient, pageContext.pageProps['vueQueryState'])
    }
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
  document.title = getPageTitle(pageContext)
}

function onHydrationEnd() {
  console.log('Hydration finished; page is now interactive.')
}
function onPageTransitionStart() {
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
function onPageTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('.content')!.classList.remove('page-transition')
}
