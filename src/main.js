import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
Vue.prototype.$moment = moment
Vue.use(ElementUI);
Vue.config.productionTip = false
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

new Vue({
  router,
  render: h => h(App),
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#root')
