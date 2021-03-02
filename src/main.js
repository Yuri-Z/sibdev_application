import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './assets/fonts/index.scss'
import './assets/styles/_globalStyles/_globalStyles.scss'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.prototype.$eventBus = new Vue([])

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
