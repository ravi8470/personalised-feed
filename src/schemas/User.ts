// src/schemas/User.ts

import { Field, Int, ObjectType } from "type-graphql";
import Topic from "./Topic";
import Article from "./Article";

@ObjectType()
export default class User {
    @Field()
    id: string;

    @Field(type => [Topic], { nullable: true })
    topics: Topic[];

    @Field(type => [Article], { nullable: true })
    articles: Article[];
}