import { renderToString } from '@vue/server-renderer'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import { createApp } from './app'
import type { Config, PageContext } from './types'
import type { PageContextBuiltInServer } from 'vike/types'
import { dehydrate } from '@tanstack/vue-query'
import { renderSSRHead } from '@unhead/ssr'
import SuperJSON from 'superjson'
import Sentry from '@sentry/vue'
import { getTraduoraToken, TraduoraToken } from '~/locales'
import { render as abortRender } from 'vike/abort';
import { Dispatcher, Agent } from 'undici'

export { onBeforeRender }
export { passToClient }
export { render }

const passToClient = [
  'vueQueryState',
  'piniaState',
  'errorWhileRendering',
  'envConfig',
  'validated',
  'statusCode',
  'redirectTo',
  'refs',
  'localeMessages',
]

// lower the fetch timeouts so that SSR is not blocked by requests
if (import.meta.env.SSR) {
  const setGlobalDispatcher = (d: Dispatcher) => (<any> global)[Symbol.for('undici.globalDispatcher.1')] = d
  if (setGlobalDispatcher) {
    const agent = new Agent({
      bodyTimeout: parseInt(process.env.FETCH_HEADERS_TIMEOUT ?? '') || 3000,
      headersTimeout: parseInt(process.env.FETCH_BODY_TIMEOUT ?? '') || 3000,
    })
    setGlobalDispatcher(agent);
  } else {
    console.warn('undici setGlobalDispatcher is not available, cannot configure timeouts')
  }
}


let cachedTraduoraToken: TraduoraToken | undefined = undefined
async function onBeforeRender(pageContext: PageContext) {
  // during runtime, inject env variables from server
  let traduora: Config['traduora'] | undefined = undefined
  if (process.env.TRADUORA_URL != undefined) {
    const url = process.env.TRADUORA_URL
    const projectId = process.env.TRADUORA_PROJECT_ID ?? ''

    if (cachedTraduoraToken == undefined || cachedTraduoraToken?.expirationDate <= new Date()) {
      const clientId = process.env.TRADUORA_CLIENT_ID ?? ''
      const secret = process.env.TRADUORA_SECRET ?? ''
      cachedTraduoraToken = await getTraduoraToken({ url, clientId, secret })
    }

    traduora = {
      url,
      projectId,
      token: cachedTraduoraToken.token,
    }
  }

  const config: Config = {
    mediaUrl: process.env.MEDIA_URL ?? '',
    cubeUrl: process.env.CUBE_URL ?? '',
    managerUrl: process.env.MANAGER_URL ?? '',
    renderUrl: process.env.RENDER_URL ?? '',
    optimizeId: process.env.OPTIMIZE_ID ?? '',
    ga4Id: process.env.GA4_ID ?? '',
    adsensePubid: process.env.ADSENSE_PUBID ?? '',
    playwireRampPublisherId: process.env.PLAYWIRE_RAMP_PUBLISHER_ID ?? '',
    playwireRampSiteId: process.env.PLAYWIRE_RAMP_SITE_ID ?? '',
    playwireRampGa4Id: process.env.PLAYWIRE_RAMP_GA4_ID ?? '',
    quantcastChoiceId: process.env.QUANTCAST_CHOICE_ID ?? '',
    sentryDsn: process.env.SENTRY_DSN ?? '',
    traduora,
  }

  const sentry = Sentry

  return {
    pageContext: {
      envConfig: config, // "config" is internally used by VPS
      sentry,
      refs: {}, // for arbitrary data, see ssrRef()
    }
  }
}

async function render(pageContext: PageContextBuiltInServer & PageContext) {
  const { app, head, pinia, router, queryClient } = createApp(pageContext)

  // FIXME memory leak caused by
  // https://github.com/vikejs/vike/blob/834c74f09bfcdf097f8990368e4abb2c624469e2/vike/shared/hooks/executeHook.ts#L71
  //  - maybe resolved when migrating to vike v1 style paths or when disabling timeout errors?
  const userHookErrorsCache: Map<object, any> = (<any>global.__vike ?? {})['utils/executeHook.ts']?.userHookErrors
  if (userHookErrorsCache != undefined && userHookErrorsCache.size > 0) {
    console.warn(`FIXME clearing ${userHookErrorsCache.size} items from vike's error cache`)
    userHookErrorsCache.clear()
  }
  // to reproduce the leak locally, uncomment & `while true; do curl localhost:3000; done`
  //throw { err: Math.random() }

  try {
    let firstError: unknown = undefined
    app.config.errorHandler = (err) => {
      firstError = firstError ?? err
      return false
    }

    router.push(pageContext.urlOriginal)
    await router.isReady()

    let string = await renderToString(app)

    if (firstError) {
      throw firstError
    }
    if (pageContext.abortStatusCode != undefined) {
      throw abortRender(pageContext.abortStatusCode, pageContext.abortReason)
    }

    const payload = await renderSSRHead(head)
    const vueQueryState = dehydrate(queryClient)
    const piniaState = SuperJSON.stringify(pinia.state.value)

    const documentHtml = escapeInject`<!DOCTYPE html>
      <html${dangerouslySkipEscape(payload.htmlAttrs)}>
        <head>
          ${dangerouslySkipEscape(payload.headTags)}
        </head>
        <body${dangerouslySkipEscape(payload.bodyAttrs)}>
          ${dangerouslySkipEscape(payload.bodyTagsOpen)}
          <div id="app">${dangerouslySkipEscape(string)}</div>
          ${dangerouslySkipEscape(payload.bodyTags)}
        </body>
      </html>`

    return {
      documentHtml,
      pageContext: {
        vueQueryState,
        piniaState,
      },
    }
  } finally {
    // queryClient.cancelQueries() // TODO: cancel queries after timeout
    // TODO to do that, implement abort signal inside useAsync and cube queries, currently this is a no-op
    // (challenging - cubejs is not designed to abort queries)

    // trigger garbage collection
    queryClient.clear()
  }
}
