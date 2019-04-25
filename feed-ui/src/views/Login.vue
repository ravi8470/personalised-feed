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
            console.log('Login:' + userCredentials);
        }
    }
}
</script>

<style scoped>

</style>
