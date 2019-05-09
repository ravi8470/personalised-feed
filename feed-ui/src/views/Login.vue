<template>
    <div>
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
    methods: {
        handleAuthSubmit(userCredentials){
            const { email, password } = userCredentials;
            this.$http.post(process.env.VUE_APP_SERVER_URL + 'login',{
                email, password
            }).then(res => {
                console.log('Login:'+ res.data);
                mutations.toggleLoading();
                if(res.data.error ){
                    const h = this.$createElement;
                    this.$notify({
                        title: 'Authentication Error',
                        message: h('b', { style: 'color: red' }, res.data.error),
                        duration: 2600
                    });
                }
                else if(res.data.auth){
                    localStorage.setItem('jwt', res.data.token);
                    localStorage.setItem('email', res.data.email);
                    store.feedArr = [];
                    store.topicsList = [];
                    store.myTopics = [];
                    this.$router.push('/Dashboard');
                }
            });
        }
    }
}
</script>

<style scoped>

</style>
