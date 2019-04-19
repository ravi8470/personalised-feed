import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class Topic {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;



}