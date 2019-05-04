<template>
  <div class="loginForm">
    <h2>{{msg}}:</h2>
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Email" prop="email">
        <el-input v-model="formData.email" suffix-icon="el-icon-message" autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="formData.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAuthSubmit('formData')">{{msg}}<i v-show="loadingIcon" class="el-icon-loading"></i></el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 

<script>
import { store, mutations } from  '../sharedStore';
export default {
  name: "Login",
  props: ["msg"],
  data() {
    return {
      formData: {
        email: "",
        password: ""
      },
      rules: {
        email: [
            { type: 'email', required: true, message: 'Please enter a valid email', trigger: 'blur' }
        ],
        password:[
            { min: 6, required: true, message: 'minimum 6 chars', trigger: 'blur' }
        ]
      }
    };
  },
  computed:{
    loadingIcon(){
      return store.showLoading;
    }
  },
  methods: {
    handleAuthSubmit(e) {
      mutations.toggleLoading();
      const userCrendentials = {
        email: this.formData.email,
        password: this.formData.password
      };
      this.$refs.formData.validate(valid => {
        if(valid){
          this.$emit("handleAuthSubmit", userCrendentials);
        }
        else{
          console.log('not valid')
          return false;
        }
      })
    }
  }
};
</script>

<style scoped>
.loginForm {
  margin-top: 15px;
  border: 3px dashed #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  padding: 15px;
}
</style>
