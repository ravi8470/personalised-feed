import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from '../node_modules/element-ui';
// import '../node_modules/element-ui/lib/theme-chalk/index.css';
// import locale from 'element-ui/lib/locale/lang/en';
import Axios from 'axios'

import {
  Dialog,
  Menu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxButton,
  Select,
  Button,
  ButtonGroup,
  Form,
  FormItem,
  Icon,
  Row,
  Col,
  Card,
  Carousel,
  CarouselItem,
  Container,
  Header,
  Footer,
  Main,
  Notification,
  Loading,
} from 'element-ui';

Vue.use(Dialog);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(Select);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Footer);
Vue.use(Main);
Vue.use(Loading);

Vue.prototype.$notify = Notification;

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
// Vue.use(ElementUI, { locale, size: 'medium', zIndex: 3000 });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
