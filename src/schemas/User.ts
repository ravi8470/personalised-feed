// src/schemas/User.ts

import { Field, ObjectType, Int } from "type-graphql";
import Topic from "./Topic";

@ObjectType()
export default class User {
    @Field()
    id: string;

    @Field(type => [Int], { nullable: true })
    topics: [number];

    @Field()
    email: string;
}