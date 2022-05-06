/**
 * 公共模块
 *
 * 用于登录、注册、权限分发 以及 主子应用通讯
 */

// 1. 公共默认数据
const COMMON_DEFAULT_DATA = {
  menu: null,
  apps: null, // 应用数据
  token: null,
  user: null,
  env: null, // 环境变量
  app: 'main', // 启用应用，区分当前是什么应用下
}

// 2. 注册公共模块方法
function registerCommonModule(store, props = {}, router, env) {
  // ps: 通过 store.hasModule(moduleName) 方法可以检查该模块是否已经被注册到 store
  if (!store || !store.hasModule) return

  // 1. 获取初始化的 state
  // ps: getGlobalState 是定义一个获取state的方法下发到子应用；提供子应用获取公共数据，最好是统一通过store.getters['common/xx']这样获取
  const initSatet = (props?.getGlobalSatet && props.getGlobalState()) || COMMON_DEFAULT_DATA

  // 2. 将父应用的数据存储到子应用中，命名空间固定为 common
  if (store.hasModule('common')) {
    // 已经注册过 common 模块
    // 每次 mount 时，都同步一次父应用数据
    store.dispatch('common/initGlobalState', initState)
  } else {
    // 第一次注册
    const commonModule = {
      namespaced: true,
      state: initSatet,
      actions: {
        // 1. 子应用改变state并通知父应用
        setGlobalState({ commit }, payload = {}) {
          commit('setGlobalState', payload)
          commit('emitGlobalState', payload)
        },
        // 2. 初始化，只用于 mount 时同步父应用的数据
        initGlobalState({ commit }, payload = {}) {
          commit('setGlobalState', payload)
        },
        // 3. 登录
        async login({ commit, dispatch }, params) {
          // 登录过程 ...
          dispatch('setGlobalState') //  改变之后，通知父应用
          return
        },
        // 4. 登出
        async logOut({ commit, dispatch }, isMain) {
          // 登出操作 ...
          dispatch('setGlobalState') //  改变之后，通知父应用
          if (router) {
            router.replace && router.replace({ name: 'Login' })
          } else {
            // 使用 window.location.href = '/login' 来跳转
          }
        },
      },
    }
  }
}
