import {Arg, Resolver, Mutation, Ctx, Int} from "type-graphql";
import User from "../schemas/User";
import { requestInterface } from "../types/requestInterface";
const util = require('util');
import { GraphQLList, GraphQLInterfaceType } from "graphql";

const pool = require('../Pool');

@Resolver(of => User)
export default class{
    
    @Mutation(returns => Boolean)
    async saveTopics(
        @Arg('topicIDs') topicIDs: String,
        @Ctx() ctx: requestInterface
    ){
        console.log('topics received as: ' + topicIDs);
        console.log('typeof' + typeof topicIDs);
        var arr = topicIDs.split(',').map(c => parseInt(c));
        // console.log(util.inspect(ctx, {showHidden: false, depth: null}));
        console.log(ctx.id);
        var res = await pool.query('UPDATE users SET topics = $1 WHERE id = $2',[arr, ctx.id]);
        return true;
    }
}