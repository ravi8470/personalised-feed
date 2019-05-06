<template>
  <div id="app">
    <div id="nav">
      <el-menu class="el-menu-demo" mode="horizontal" router=true :default-active="currentRoute">
        <a class="el-menu-item">FEED APP</a>
        <el-menu-item index="/">
          <router-link to="/">HOME</router-link>
        </el-menu-item>
        <el-menu-item index="/register" v-if="!checkLogin()">
          <router-link  to="/register">REGISTER</router-link>
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
        <a @click="fetchTopics" v-show="checkLogin()" class="el-menu-item">CUSTOMIZE FEED</a>
        <a @click="logout" v-show="checkLogin()" class="el-menu-item">LOGOUT</a>
      </el-menu>
    </div>
    <router-view/> <!-- this is important as it helps with vue-routing -->
    <el-dialog title="Select Topics" :visible.sync="addTopicsDialogVisible" width="70%" >
      <span v-for="topic in topicsArr" v-bind:key="topic.id">
        <el-checkbox-button class="topict" :key="topic.id" v-model="topicsArr[topic.id-1].selected">{{topic.name}}</el-checkbox-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTopicsDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveTopics">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default   {
  data(){
    return{
      addTopicsDialogVisible: false,
      topicsArr: []
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('jwt');
      localStorage.removeItem('email');
      const h = this.$createElement;
      this.$notify({
        message: h('b', { style: 'color: green' }, 'Successfully Logged out.')
      });
      this.$router.push('/');
    },
    checkLogin(){
      return localStorage.getItem('email') != null;
    },
    fetchTopics(){
      this.$http({
        url: 'http://localhost:3000/graphql', 
        method: 'post',
        data: { 
            query: `{topics {name,id}} `, 
            token: localStorage.getItem('jwt')
        }
      }).then((result) => {
        if(result.data.error){
            this.showNotif('Authentication Error', result.data.error);
            localStorage.removeItem('jwt');
            localStorage.removeItem('email');
            this.$router.push('/login');
        }
        else{
          this.addTopicsDialogVisible = true;
          this.topicsArr = result.data.data.topics.map( (item) => { item.selected = false; return item;});
        }
      });
    },
    saveTopics(){
      var topicIDs = [];
      topicIDs = this.topicsArr.filter(x => x.selected == true).map(y => y.id);
      console.log('topicids' + topicIDs);
      var topicIDStr = topicIDs.join();
      console.log('string generated:' + typeof topicIDStr);
      this.$http({
          url: 'http://localhost:3000/graphql',
          method: 'post',
          data: {
              "query": "mutation ($topicIDs: String!) { saveTopics(topicIDs: $topicIDs) } ",
              "variables": {"topicIDs": topicIDStr},
              arr: topicIDs,
              token: localStorage.getItem('jwt')
          }
      }).then(res => {
          this.addTopicsDialogVisible = false;
          this.showNotif('','Topics saved successfully');
      }).catch(err => {
          this.addTopicsDialogVisible = false;
          this.showNotif('Error', err);``
      });
    },
    showNotif(title,Msg){
      const h = this.$createElement;
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

</style>
