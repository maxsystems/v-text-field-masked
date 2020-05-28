import Vue from 'vue'

import Vuetify, { VApp, VContent } from 'vuetify/lib'

import App from './App'

Vue.use(Vuetify)

const vuetify = new Vuetify()

export default new Vue({
  render: h => h(VApp, [h(VContent, [h(App)])]),
  vuetify
}).$mount('#app')
