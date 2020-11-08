import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.mixin({
  methods: {
    fixedDecimals(num) {
      return `${num}`.substring(0, 2);
    },
    reduceArrayKeys(originalArray, keysToKeep) {
      return originalArray.map((item) => keysToKeep
        .reduce((acc, key) => {
          acc[key] = item[key];
          return acc;
        }, {}));
    },
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
