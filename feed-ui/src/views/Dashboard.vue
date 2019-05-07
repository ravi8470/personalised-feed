<template>
    <div class="dashboardContainer">
        <h3 class="yourFeedText">Your Feed:</h3>
        <el-container>
            <el-main>
                <div v-for="feedItem in feedArrPaginate" v-bind:key="feedItem.id" class="feedContainer">
                    <el-col :span="18">
                        <el-card shadow="hover">
                            <a :href="feedItem.url"  :class="feedItem">{{feedItem.title}}</a>
                        </el-card>
                    </el-col>
                </div>
                <!-- <h4 v-show="endOfFeed" class="el-container feedContainer">That's all Folks!</h4> -->
            </el-main>
        </el-container>
        <!-- <el-button @click="addTopic">add topic</el-button> -->
    </div>
</template>

<script>
import Vue from 'vue';
import {store, mutations} from "../sharedStore.js";
    export default {
        data () {
            return {
                email: localStorage.getItem('email'),
                feedArrPaginate: [],
                totalFeedItems: store.feedArr.length,
                displayedItemsCount: 0,
                bottomReached: false,
                endOfFeed: false
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
            isBottomReached(){
                var result = (document.documentElement.clientHeight == document.documentElement.scrollHeight)  ||
                ( (window.scrollY + document.documentElement.clientHeight) >= (document.documentElement.scrollHeight-2));
                // console.log(`scrollheight: ${document.documentElement.scrollHeight}, clientheight: ${document.documentElement.clientHeight}, scrollY++: ${window.scrollY+ document.documentElement.clientHeight}`);
                // console.log(`result was ${result}`);
                return result;
            },
            renderFeed(){
                if(this.displayedItemsCount < this.totalFeedItems){
                    this.feedArrPaginate.push(store.feedArr[this.displayedItemsCount++]);
                    var myObj = this;
                    Vue.nextTick(function () {
                        if(myObj.isBottomReached()){
                            myObj.renderFeed();
                        }
                    })    
                }
                else if(this.displayedItemsCount == store.feedArr.length){
                    this.showNotif('End Of Feed.');
                }
            }
        },
        watch: {
            bottomReached(newVal){
                // console.log(`watcher sasys ${newVal}`);
                if(newVal == true){//meaning bottom is reached
                    this.renderFeed();
                }

            }
        },
        mounted() {
            if(store.feedArr.length == 0){
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
                        store.feedArr = result.data.data.getArticles;
                        console.log(result.data)
                        this.totalFeedItems = store.feedArr.length;
                        this.renderFeed();
                    }
                })
            }
            else if(store.feedArr.length > 0){
                this.renderFeed();
            }
        },
        created(){
            window.addEventListener('scroll', () => {
                this.bottomReached = this.isBottomReached();
            });
        },
        // computed: {
        //     endOfFeed(){
        //         return this.totalFeedItems==this.displayedFeedItems;
        //     }
        // }
    }
</script>

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
    .dashboardContainer{
        background-color: #eaf0f1;
    }
    .el-card{
        margin-top:0;
        margin-bottom:8px;
        border: 1px solid rgb(233, 255, 255);
        /* background-color: rgb(228, 243, 243) */
    }
    .feedContainer{
        text-align: left;
    }
    .yourFeedText{
        margin-top: 0;
        margin-bottom: 0;
        border-bottom: 1px solid red;
    }
    
</style>