<template>
    <div>
        <h3>Your Feed:</h3>
        <el-container>
            <el-main>
                <div v-for="feedItem in feedArr" v-bind:key="feedItem.id">
                    <el-col :span="18">
                        <el-card shadow="hover">
                            <a :href="feedItem.url"  :class="feedItem">{{feedItem.title}}</a>
                        </el-card>
                    </el-col>
                </div>
            </el-main>
        </el-container>
        <!-- <el-button @click="addTopic">add topic</el-button> -->
    </div>
</template>

<script>
    export default {
        data () {
            return {
                email: localStorage.getItem('email'),
                feedArr: [],
                feedLoaded: false,
                num:0
            }
        },
        methods: {
            showNotif(title,Msg){
                const h = this.$createElement;
                this.$notify({
                    title: title,
                    message: Msg
                });
            },
            addTopic(){
                this.$http({
                    url: 'http://localhost:3000/graphql',
                    method: 'post',
                    data: {
                        "query": "mutation ($name: String!) { addTopic(topicName: $name) } ",
                        "variables": {"name":'' },
                        token: localStorage.getItem('jwt')
                    }
                })
            }
        },
        mounted() {
            if(!this.feedLoaded)
            {
                this.$http({
                    url: 'http://localhost:3000/graphql', 
                    method: 'post',
                    data: { 
                        query: `{getArticles{id, url, title} } `, 
                        token: localStorage.getItem('jwt')
                    }   
                }).then( result => {
                    if(result.data.error){
                        this.showNotif('Authentication Error', result.data.error);
                        localStorage.removeItem('jwt');
                        localStorage.removeItem('email');
                        this.$router.push('/login');
                    }
                    else{
                        this.feedArr = result.data.data.getArticles;
                        this.feedLoaded = true;
                        console.log(result.data)
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #18a1cb;
        text-decoration: none
    }
    .el-checkbox-button{
        margin: 5px;
    }
    .el-card{
        margin: 5px;
        border: 1px solid rgb(184, 183, 183);
    }
    .el-main{
        text-align: left;
    }
    h3{
        margin: 1px;
    }
</style>