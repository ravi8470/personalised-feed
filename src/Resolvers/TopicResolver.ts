import "reflect-metadata";
import {Arg, Query, Resolver, Mutation} from "type-graphql";
import Topic from '../schemas/Topic';
import util = require("util");
const pool = require('../Pool');

@Resolver(of => Topic)
export default class{

    @Query(returns => [Topic])
    async topics(){
        var allTopics: [Topic];
        await pool.query('SELECT * FROM topics').then(res =>  allTopics = res.rows).catch(err =>{
            console.log("error occurred" + err);
        });
        return allTopics!;
    }
    @Mutation(returns => Boolean)
    async addTopic(
        @Arg('topicName') topicName: string
    ){
        var result = await pool.query('INSERT INTO topics (name) VALUES ($1)',[topicName]);
        console.log(util.inspect(result, {showHidden: false, depth: null}));
        return result.rowcount == 1 ?  true: false;

    }

}