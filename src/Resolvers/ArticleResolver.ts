import {Resolver, Ctx, Int, Query} from "type-graphql";
import { requestInterface } from "../types/requestInterface";
import Article from "../schemas/Article";

const pool = require('../Pool');

@Resolver(of => Article)
export default class{
    
    @Query(returns => [Article])
    async getArticles(
        @Ctx() ctx: requestInterface
    ){
        console.log('getArticles');
        console.log(ctx.id);
        var res = await pool.query('SELECT topics from users where id = $1',[ctx.id]);
        console.log(res.rows[0].topics);
        var re = await pool.query('SELECT * from articles where topic_id = ANY($1)',[res.rows[0].topics]);
        // console.log(re.rows);
        return re.rows;
    }
}