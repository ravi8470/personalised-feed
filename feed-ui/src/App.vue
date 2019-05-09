<template>
  <div id="app">
    <div id="nav">
      <el-menu class="el-menu-demo" mode="horizontal" background-color="#E8F2F2" router=true :default-active="currentRoute">
        <a class="el-menu-item">FEED APP</a>
        <el-menu-item index="/">
          <router-link to="/">HOME</router-link>
        </el-menu-item>
        <el-menu-item index="/dashboard" v-if="checkLogin()">
          <router-link to="/dashboard">DASHBOARD</router-link>
        </el-menu-item>
        <el-menu-item index="/about">
          <router-link to="/about">ABOUT</router-link>
        </el-menu-item>
        <el-menu-item index="/login" v-if="!checkLogin()">
          <router-link  to="/login">LOGIN</router-link>
        </el-menu-item>
        <el-menu-item index="/register" v-if="!checkLogin()">
          <router-link  to="/register">REGISTER</router-link>
        </el-menu-item>
        <a @click="fetchTopics" v-if="checkLogin()" class="el-menu-item">CUSTOMIZE FEED</a>
        <a @click="logout" v-if="checkLogin()" class="el-menu-item">LOGOUT</a>
      </el-menu>
    </div>
    <router-view/> <!-- this is important as it helps with vue-routing -->
    <el-dialog title="Select Topics" :visible.sync="addTopicsDialogVisible" width="70%" >
      <span v-for="topic in topicsArr" v-bind:key="topic.id">
        <el-checkbox-button :key="topic.id" v-model="topicsArr[topic.id-1].selected">{{topic.name}}</el-checkbox-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTopicsDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveTopics">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {store} from "./sharedStore.js";
export default   {
  data(){
    return{
      addTopicsDialogVisible: false,
      topicsArr: store.topicsList
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('jwt');
      localStorage.removeItem('email');
      store.feedArr = [];
      store.topicsList = [];
      store.myTopics = [];
      const h = this.$createElement;
      this.$notify({
        message: h('b', { style: 'color: green' }, 'Successfully Logged out.')
      });
      this.$router.push('/');
    },
    checkLogin(){
      return localStorage.getItem('email') != null;
    },
    async fetchTopics(){
      console.log(`store topics leng; ${store.topicsList.length}`)
      if(store.topicsList.length == 0){
        this.$http({
        url: process.env.VUE_APP_SERVER_URL + 'graphql', 
        method: 'post',
        data: { 
            query: `{topics {name,id}} `, 
            token: localStorage.getItem('jwt')
        }
        }).then(async (result) => {
          if(result.data.error){
              this.showNotif('Authentication Error', result.data.error);
              localStorage.removeItem('jwt');
              localStorage.removeItem('email');
              this.$router.push('/login');
          }
          else{
            await this.$http({
              url:process.env.VUE_APP_SERVER_URL + 'graphql',
              method: 'post',
              data:{
                query: `{myTopics {topics}} `, 
                token: localStorage.getItem('jwt')
              }
            }).then( res => {
                if(res.data.data.myTopics['topics']){
                  console.log('mytopics arrived: ' + res.data.data.myTopics['topics'])
                  store.myTopics = res.data.data.myTopics['topics'];
                }
            })
            store.topicsList = result.data.data.topics.map( (item) => { item.selected = false; return item;});
            for(const p of store.topicsList){
              if(store.myTopics.indexOf(p.id) > -1){
                p.selected = true;
              }
            }
            console.log(`after modifying selected ; ${store.topicsList}`);
            this.topicsArr = store.topicsList;
            this.addTopicsDialogVisible = true;
          }
        });
      }
      else if(store.topicsList.length > 0){
        this.addTopicsDialogVisible = true;
      }
    },
    saveTopics(){
      var topicIDs = [];
      topicIDs = this.topicsArr.filter(x => x.selected == true).map(y => y.id);
      console.log('topicids' + topicIDs);
      var topicIDStr = topicIDs.join();
      console.log('string generated:' + typeof topicIDStr);
      this.$http({
          url: process.env.VUE_APP_SERVER_URL + 'graphql',
          method: 'post',
          data: {
              "query": "mutation ($topicIDs: String!) { saveTopics(topicIDs: $topicIDs) } ",
              "variables": {"topicIDs": topicIDStr},
              arr: topicIDs,
              token: localStorage.getItem('jwt')
          }
      }).then(() => {
          this.addTopicsDialogVisible = false;
          this.showNotif('','Feed customized successfully. Refresh to see changes.');
          store.feedArr = [];
      }).catch(err => {
          this.addTopicsDialogVisible = false;
          this.showNotif('Error', err);``
      });
    },
    showNotif(title,Msg){
      this.$notify({
          title: title,
          message: Msg
      });
    }
  },
  computed:{
    currentRoute(){
      return this.$route.path;
    },
    // checkLogin(){
    //   return localStorage.getItem('email') != null;
    // }
  }
}
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.el-menu-item{
  text-decoration: none;
  align-content: center;
}
.el-checkbox-button{
  margin: 5px;
}

</style>
