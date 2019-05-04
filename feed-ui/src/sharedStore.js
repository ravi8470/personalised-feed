import Vue from "vue";

export const store = Vue.observable({
  showLoading: false
});

export const mutations = {
  toggleLoading() {
    store.showLoading = !store.showLoading;
  }
};