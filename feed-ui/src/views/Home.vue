<template>
  <div class="home">
    <h1>Welcome to your Personalised Feed App</h1><hr>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in itemsArr" :key="item">
        <h3 class="large">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    <hr>
    <h3 class="bottomText">Register & Login to generate your Personalised Feed.</h3>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  data(){
    return{
      itemsArr:['Select from over a million(:-p) topics like Coding, Law, Marketing, Javascript, Economics, History','JWT Based Fast and Secure Authentication','Powered by Element-UI','Single Page Application Made with Vue']
    }
  }
};
</script>

<style scoped>
  .home{
    background-color: #E9E9E9;
  }
  h1{
    margin-top: 0;
    padding-top: 50px;
    color: #4EB1BA;
  }
  .el-carousel__item h3 {
    font-family: cursive;
    color:#4EB1BA;
    font-size: 1.5rem;
    opacity: 0.75;
    padding-top: 100px;
    /* line-height: 200px; */
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #222930;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #222930;
  }
  .bottomText{
    padding-bottom: 300px;
    color: #4EB1BA;
  }
</style>
