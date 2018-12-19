import { getUserInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
import Http from '@/utils/httpUtil'
import md5 from 'md5'
import storageUtil from '@/utils/storageUtil'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return Http.post('auth/login', {
        account: username,
        password: md5(userInfo.password),
        platform: 'pc'
      }).then((data) => {
        window._token = data.data.token
        localStorage.setItem('token', data.data.token)
        storageUtil.initUserInfo({
          ...data.data,
          isLogin: true
        })
        return data.data
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut() {
      return Http.get('auth/logout', {
        token: localStorage.getItem('token'),
        platform: 'mobile'
      }).then(() => {
        localStorage.removeItem('token')
        storageUtil.initUserInfo({
          isLogin: false
        })
      })
    }
  }
}

export default user
