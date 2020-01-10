import { asyncRouterMap, constantRouterMap } from '@/router'
import permissionUtil from '@/utils/permission'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    ifAdd: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers.concat(constantRouterMap)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        commit('SET_ROUTERS', permissionUtil.filterAsyncRouter(asyncRouterMap, roles))
        resolve()
      })
    }
  }
}

export default permission
