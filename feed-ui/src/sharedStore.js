import Vue from "vue";

export const store = Vue.observable({
  showLoading: false,
  topicsList: [],
  feedArr: [],
});

export const mutations = {
  toggleLoading() {
    store.showLoading = !store.showLoading;
  }
};