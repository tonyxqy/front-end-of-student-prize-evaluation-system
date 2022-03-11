import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
export default new Vuex.Store({
  // 用于操作数据
  state: {
    stuInfo: {
      grade: "请登录",
      student: "请登录",
      name: "请登录",
      id: "请登录"
    },
  },
  // 用于操作数据
  mutations: {
    update(state){
      if (sessionStorage.getItem("stuInfo")) {
        state.stuInfo = JSON.parse(sessionStorage.getItem("stuInfo"));
      }
    },
  },
  // 用于响应组件中的动作
  actions: {
  },
  modules  
})
