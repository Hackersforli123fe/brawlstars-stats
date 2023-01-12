import { renderToNodeStream } from '@vue/server-renderer'
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr'
import { createApp } from './app'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { dehydrate } from '@tanstack/vue-query'
import { renderSSRHead } from '@unhead/ssr'

export { passToClient }
export { render }

const passToClient = ['vueQueryState', 'documentProps', 'locale']

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { app, head, queryClient } = await createApp(pageContext)

  const stream = await renderToNodeStream(app)
  const waitUntilNotFetching = () => new Promise(resolve => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const countFetching = queryClient.isFetching()
      if (countFetching == 0) {
        unsubscribe()
        resolve(undefined)
      }
    })
  })
  if (queryClient.isFetching() > 0) {
    await waitUntilNotFetching()
  }
  const vueQueryState = dehydrate(queryClient)

  const payload = await renderSSRHead(head)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html${payload.htmlAttrs}>
      <head>
        ${dangerouslySkipEscape(payload.headTags)}
      </head>
      <body${payload.bodyAttrs}>
        ${payload.bodyTagsOpen}
        <div id="app" class="dark">${stream}</div>
        ${payload.bodyTags}
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      //enableEagerStreaming: true,
      vueQueryState,
    },
  }
}
