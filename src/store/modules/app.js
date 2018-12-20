import storageUtil from '@/utils/storageUtil'

const app = {
  state: {
    sidebar: {
      opened: storageUtil.getAppConfig('sidebarStatus') === 1,
      withoutAnimation: false
    },
    device: 'desktop',
    language: storageUtil.getAppConfig('language') || 'zh'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        storageUtil.setAppConfig('sidebarStatus', 0)
      } else {
        storageUtil.setAppConfig('sidebarStatus', 1)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      storageUtil.setAppConfig('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      storageUtil.setAppConfig('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      storageUtil.setAppConfig('size', size)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
