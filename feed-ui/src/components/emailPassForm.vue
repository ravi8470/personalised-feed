<template>
  <div class="loginForm">
    <h2>{{msg}}:</h2>
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="Email" prop="email">
        <el-input v-model="formData.email" suffix-icon="el-icon-message"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="formData.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAuthSubmit">{{msg}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
  methods: {
    handleAuthSubmit(e) {
      e.preventDefault();
      const userCrendentials = {
      // id: uuid.v4(),
      email: this.formData.email,
      password: this.formData.password
      };
      this.$emit("handleAuthSubmit", userCrendentials);
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
