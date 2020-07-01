import Vue from 'vue'
import App from './App.vue'
import { store } from './store';
import router from './routes'

Vue.config.productionTip = false

// Make application
new Vue({
  el: '#app',
  store: store,
  router: router,
  render: h => h(App),  
}).$mount('#app')
