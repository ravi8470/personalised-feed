<template>
    <div>
        <p style="color:red">{{Errors}}</p>
        <emailPassForm msg="Login" v-on:handleAuthSubmit="handleAuthSubmit"/>
    </div>
</template>

<script>
import emailPassForm from "../components/emailPassForm.vue";
import { store, mutations } from  '../sharedStore';
export default {
    components: {
        emailPassForm
    },
    data: function() {
        return {
            Errors: ""
        }
    },
    methods: {
        handleAuthSubmit(userCredentials){
            const { email, password } = userCredentials;
            this.$http.post('http://localhost:3000/login',{
                email, password
            }).then(res => {
                console.log('Login:'+ res.data);
                mutations.toggleLoading();
                if(res.data.error ){
                    this.Errors = res.data.error;
                }
                else if(res.data.auth){
                    localStorage.setItem('jwt', res.data.token);
                    localStorage.setItem('email', res.data.email);
                    this.$router.push('/Dashboard');
                }
            });
        }
    }
}
</script>

<style scoped>

</style>
