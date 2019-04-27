<template>
    <emailPassForm msg="Register" v-on:handleAuthSubmit="handleAuthSubmit"/>
</template>

<script>
import emailPassForm from "../components/emailPassForm.vue";
export default {
    components: {
        emailPassForm
    },
    methods: {
        handleAuthSubmit(userCredentials){
            const { email, password} = userCredentials;
            console.log('Register' + userCredentials.email + userCredentials.password);
            // axios.post('http://localhost:3000/',{
            //     email, password
            // }).then(res => console.log(res.data)).catch(err => console.log(err));
            this.$http.post('http://localhost:3000/register',{
                email, password
            }).then(res => console.log(res.data));
        }
    }
}
</script>

<style scoped>

</style>