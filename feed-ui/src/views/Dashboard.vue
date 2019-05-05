<template>
    <div>
        <el-button type="primary" @click="fetchTopics">Add Topics for your Feed</el-button>
        <el-dialog title="Select Topics" :visible.sync="addTopicsDialogVisible" width="70%" >
            <span v-for="topic in topicsArr" v-bind:key="topic.id">
                <el-checkbox-button class="topict" :key="topic.id" v-model="topicsArr[topic.id-1].selected">{{topic.name}}</el-checkbox-button>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addTopicsDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveTopics">Save</el-button>
            </span>
        </el-dialog>
        <el-container>
            <el-main>
                <div v-for="feedItem in feedArr" v-bind:key="feedItem.id">
                    <el-col :span="24">
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
                addTopicsDialogVisible: false,
                topicsArr: [],
                feedArr: [],
                feedLoaded: false,
                num:0
            }
        },
        methods: {
            fetchTopics(){
                this.$http({
                    url: 'http://localhost:3000/graphql', 
                    method: 'post',
                    data: { 
                        query: `{topics {name,id}} `, 
                        token: localStorage.getItem('jwt')
                    }
                }).then((result) => {
                    if(result.data.error){
                        this.showNotif('Authentication Error', result.data.error);
                        localStorage.removeItem('jwt');
                        localStorage.removeItem('email');
                        this.$router.push('/login');
                    }
                    else{
                        this.addTopicsDialogVisible = true;
                        this.topicsArr = result.data.data.topics.map( (item) => { item.selected = false; return item;});
                    }
                    
                });
            },
            saveTopics(){
                var topicIDs = [];
                topicIDs = this.topicsArr.filter(x => x.selected == true).map(y => y.id);
                console.log('topicids' + topicIDs);
                console.log('type of topicIDS'+typeof topicIDs)
                var topicIDStr = topicIDs.join();
                console.log('string generated:' + typeof topicIDStr);
                this.$http({
                    url: 'http://localhost:3000/graphql',
                    method: 'post',
                    data: {
                        "query": "mutation ($topicIDs: String!) { saveTopics(topicIDs: $topicIDs) } ",
                        "variables": {"topicIDs": topicIDStr},
                        arr: topicIDs,
                        token: localStorage.getItem('jwt')
                    }
                }).then(res => {
                    this.addTopicsDialogVisible = false;
                    this.showNotif('','Topics saved successfully');
                }).catch(err => {
                    this.addTopicsDialogVisible = false;
                    this.showNotif('Error', err);
                });
            },
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
                        "variables": {"name": 'ravi'},
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
</style>