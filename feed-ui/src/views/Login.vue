<template>
    <emailPassForm msg="Login" v-on:handleAuthSubmit="handleAuthSubmit"/>
</template>

<script>
import emailPassForm from "../components/emailPassForm.vue";
export default {
    components: {
        emailPassForm
    },
    methods: {
        handleAuthSubmit(userCredentials){
            const { email, password } = userCredentials;
            this.$http.post('http://localhost:3000/login',{
                email, password
            }).then(res => console.log(res.data));
        }
    }
}
</script>

<style scoped>

</style>
