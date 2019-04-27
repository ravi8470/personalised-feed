import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from '../node_modules/element-ui';
import '../node_modules/element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import Axios from 'axios'

Vue.prototype.$http = Axios;
Vue.config.productionTip = false
Vue.use(ElementUI, { locale, size: 'medium', zIndex: 3000 });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
