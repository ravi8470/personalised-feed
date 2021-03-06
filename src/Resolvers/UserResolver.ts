import {Arg, Resolver, Mutation, Ctx, Int, Query} from "type-graphql";
import User from "../schemas/User";
import { requestInterface } from "../types/requestInterface";
const util = require('util');
import { GraphQLList, GraphQLInterfaceType } from "graphql";

const pool = require('../Pool');

@Resolver(of => User)
export default class{
    
    @Mutation(returns => Boolean)
    async saveTopics(
        @Arg('topicIDs') topicIDs: string,
        @Ctx() ctx: requestInterface
    ){
        console.log('topics received as: ' + topicIDs.length);
        console.log('typeof' + typeof topicIDs);
        if(topicIDs.length == 0){
            await pool.query('UPDATE users SET topics = $1 WHERE id = $2',['{}', ctx.id]);
        }
        else{
            var arr = topicIDs.split(',').map(c => parseInt(c));
            console.log(ctx.id);
            var res = await pool.query('UPDATE users SET topics = $1 WHERE id = $2',[arr, ctx.id]);
        }
        return true;
    }

    @Query(returns => User)
    async myTopics(
        @Ctx() ctx: requestInterface
    ){
        var res = await pool.query(`SELECT * from users where id = $1`,[ctx.id]);
        console.log(res.rows[0]);
        return res.rows[0];
    }
}