import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class Article {
    @Field()
    id: string;

    @Field()
    url: string;

    @Field()
    title: string;

    @Field()
    topic_id: number; 

}