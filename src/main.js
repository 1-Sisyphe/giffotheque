import Vue from 'vue'
import App from './App.vue'
import {VueMasonryPlugin} from 'vue-masonry';
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'

Vue.config.productionTip = false
Vue.use(require('vue-moment'));
Vue.use(VueMasonryPlugin)
Vue.use(Vuesax)
new Vue({
  render: h => h(App),
}).$mount('#app')
