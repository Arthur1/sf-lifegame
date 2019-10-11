import Vue from 'vue'
import App from './App.vue'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import 'noto-sans-jp/noto_sans_jp_regular/css.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
