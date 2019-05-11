import Vue from "vue";
import axios from "axios";
export const store = Vue.observable({
  showLoading: false,
  topicsList: [],
  feedArr: [],
  myTopics: [],
  customizeFeedDialogVisible: false
});

export const mutations = {
  toggleLoading() {
    store.showLoading = !store.showLoading;
  },
  async fetchAllTopics(){
    console.log('fetch ALL topics called')
    if(store.topicsList.length == 0){
      await axios({
      url: process.env.VUE_APP_SERVER_URL + 'graphql', 
      method: 'post',
      data: { 
          query: `{topics {name,id}} `, 
          token: localStorage.getItem('jwt')
      }
      }).then((result) => {
        store.topicsList = result.data.data.topics.map( (item) => { item.selected = false; return item;});
      })
    }
  },
  async fetchMyTopics(){
    console.log('fetch MY topics called');
    if(store.myTopics.length == 0){
      await axios({
        url:process.env.VUE_APP_SERVER_URL + 'graphql',
        method: 'post',
        data:{
          query: `{myTopics {topics}} `, 
          token: localStorage.getItem('jwt')
        }
      }).then( res => {
          if(res.data.data.myTopics['topics']){
            store.myTopics = res.data.data.myTopics['topics'];
          }
      })
    }
  }
};