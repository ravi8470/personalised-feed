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
            console.log('Register' + userCredentials.email + userCredentials.password);
        }
    }
}
</script>

<style scoped>

</style>