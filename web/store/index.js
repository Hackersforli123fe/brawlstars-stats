import { exception, event } from 'vue-analytics'

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// immutable
function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export const state = () => ({
  version: undefined,
  featuredPlayers: [ {
      tag: 'V8LLPPC',
      name: 'xXcuzMePlisThXx',
    }, {
      tag: '8PJRRG2C',
      name: 'TQ|GuilleVGX',
    }, {
      tag: 'V9QGJY9',
      name: 'Landi',
    }, {
      tag: '2L892GP',
      name: 'YAPIMARU_YT',
    }, {
      tag: '2Y02L28',
      name: 'Keith ツ',
    } ],
  tagPattern: '^[0289PYLQGRJCUV]{3,}$',
  lastPlayers: [],
  player: {
    tag: '',
    modes: [],
    heroes: [],
  },
  currentEvents: [],
  currentEventsLoaded: false,
  upcomingEvents: [],
  upcomingEventsLoaded: false,
  leaderboard: [],
  leaderboardLoaded: false,
  bestByEvent: {},
  modeMeta: [],
  modeMetaLoaded: false,
  cookiesAllowed: false,
  adsAllowed: false,
  consentPopupVisible: true,
  installBannerDismissed: false,
  totalBrawlers: 38,
  bsuArticles: [],
  bsuArticlesLoaded: false,
  isApp: false,
  installPrompt: undefined,
})

export const getters = {
  playerRank(state) {
    if (state.player.tag === '' || !state.leaderboardLoaded) {
      return 0
    }

    return state.leaderboard
      .map(({ tag }) => tag)
      .indexOf(state.player.tag) + 1
  },
  isInstallable(state) {
    const isAndroid = process.client && /android/i.test(navigator.userAgent)
    return state.installPrompt !== undefined || (!state.isApp && isAndroid)
  },
}

export const mutations = {
  setPlayer(state, player) {
    state.player = player
  },
  setPlayerHistory(state, playerHistory) {
    state.player = mergeDeep(state.player, playerHistory)
  },
  setPlayerWinrates(state, playerWinrates) {
    state.player = mergeDeep(state.player, playerWinrates)
  },
  setPlayerData(state, { player, history, winrates }) {
    state.player = mergeDeep(mergeDeep(player, history), winrates)
  },
  addLastPlayer(state, player) {
    const clone = obj => JSON.parse(JSON.stringify(obj))

    const lastPlayers = [clone(player), ...state.lastPlayers]
      .filter((player, index, arr) => index == arr.findIndex(p => p.tag == player.tag)) // unique
    state.lastPlayers = lastPlayers.slice(0, 4)
  },
  setCurrentEvents(state, currentEvents) {
    state.currentEvents = currentEvents
    state.currentEventsLoaded = true
  },
  setUpcomingEvents(state, upcomingEvents) {
    state.upcomingEvents = upcomingEvents
    state.upcomingEventsLoaded = true
  },
  setLeaderboard(state, leaderboard) {
    state.leaderboard = leaderboard
    state.leaderboardLoaded = true
  },
  setModeMeta(state, meta) {
    state.modeMeta = meta
    state.modeMetaLoaded = true
  },
  allowAds(state) {
    state.adsAllowed = true
  },
  disallowAds(state) {
    state.adsAllowed = false
  },
  allowCookies(state) {
    state.cookiesAllowed = true
  },
  disallowCookies(state) {
    state.cookiesAllowed = false
  },
  showConsentPopup(state) {
    state.consentPopupVisible = true
  },
  hideConsentPopup(state) {
    state.consentPopupVisible = false
  },
  dismissInstallBanner(state) {
    state.installBannerDismissed = true
  },
  setBsuArticles(state, articles) {
    state.bsuArticles = articles
    state.bsuArticlesLoaded = true
  },
  setIsApp(state) {
    state.isApp = true
  },
  setInstallPrompt(state, prompt) {
    state.installPrompt = prompt
  },
  clearInstallPrompt(state) {
    state.installPrompt = undefined
  },
}

export const actions = {
  async loadPlayer({ state, commit }, playerTag) {
    if (playerTag === state.player.tag) {
      return
    }

    const player = await this.$axios.$get(`/api/player/${playerTag}`)
    commit('setPlayer', player)
  },
  async loadPlayerHistory({ state, commit }) {
    const playerHistory = await this.$axios.$get(`/api/player/${state.player.tag}/history`)
    commit('setPlayerHistory', playerHistory)
  },
  async loadPlayerWinrates({ state, commit }) {
    const playerWinrates = await this.$axios.$get(`/api/player/${state.player.tag}/winrates`)
    commit('setPlayerWinrates', playerWinrates)
  },
  async refreshPlayer({ state, commit }) {
    const player = await this.$axios.$get(`/api/player/${state.player.tag}`)
    const history = await this.$axios.$get(`/api/player/${state.player.tag}/history`)
    const winrates = await this.$axios.$get(`/api/player/${state.player.tag}/winrates`)
    commit('setPlayerData', { player, winrates, history })
  },
  async loadLeaderboard({ state, commit }) {
    if (state.leaderboardLoaded) {
      return
    }

    try {
      const leaderboard = await this.$axios.$get('/api/leaderboard/hours')
      commit('setLeaderboard', leaderboard)
    } catch (error) {
      // not critical, ignore
      exception('cannot get leaderboard: ' + error.message)
      console.error('cannot get leaderboard:', error.message)
    }
  },
  async loadModeMeta({ state, commit }) {
    if (state.modeMetaLoaded) {
      return
    }

    try {
      const meta = await this.$axios.$get('/api/meta/mode')
      commit('setModeMeta', meta)
    } catch (error) {
      // not critical, ignore
      exception('cannot get mode meta: ' + error.message)
      console.error('cannot get mode meta:', error.message)
    }
  },
  async install({ state, commit }) {
    const pwaSupported = state.installPrompt !== undefined
    if (!pwaSupported) {
      const referrer = '&referrer=utm_source%3Dwebsite%26utm_medium%3Dfallback'
      event('app', 'redirect_store', 'fallback')
      window.open('https://play.google.com/store/apps/details?id=xyz.schneefux.brawltimeninja' + referrer, '_blank')
    } else {
      state.installPrompt.prompt()
      const choice = await state.installPrompt.userChoice
      event('app', 'prompt', choice.outcome)
      commit('clearInstallPrompt')
    }
  },
}
