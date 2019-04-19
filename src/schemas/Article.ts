import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class Article {
    @Field(type => Int)
    id: number;

    @Field()
    url: string;

    @Field()
    title: string;

}