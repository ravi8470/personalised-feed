<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <router-link v-if="!checkLogin()" to="/register">|Register</router-link>
      <router-link v-if="!checkLogin()" to="/login">|Login</router-link>
      <router-link v-if="checkLogin()" to="/dashboard">|Dashboard</router-link>
      <a v-if="checkLogin()" @click="logout" class="router-link">|Logout</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default   {
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
    }
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
</style>
