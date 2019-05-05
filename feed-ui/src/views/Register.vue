<template>
    <div>
        <emailPassForm msg="Register" v-on:handleAuthSubmit="handleAuthSubmit"/>
    </div>
</template>

<script>
import { store, mutations } from  '../sharedStore';
import emailPassForm from "../components/emailPassForm.vue";
export default {
    components: {
        emailPassForm
    },
    methods: {
        handleAuthSubmit(userCredentials){
            const { email, password} = userCredentials;
            this.$http.post('http://localhost:3000/register',{
                email, password
            }).then(res => {
                mutations.toggleLoading();
                console.log(res.data);
                const h = this.$createElement;
                if(res.data.error){
                    this.$notify({
                        title: 'Registration Error',
                        message: h('b', { style: 'color: red' }, res.data.error),
                        duration: 2600
                    });
                }
                if(res.data.Success){
                    this.$notify({
                        title: 'Success',
                        message: h('b', { style: 'color: green' }, res.data.Success)
                    });
                    this.$router.replace('/login');
                }
                
            });
        }
    }
}
</script>

<style scoped>

</style>