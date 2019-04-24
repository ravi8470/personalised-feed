import "reflect-metadata";
//import graphql related imports here

import express from "express";
import * as testStuff from "../utilities/testFile";
async function bootstrap() {
    var app: express.Application = express();

    app.get('/', (req, res) => {
        res.send('Hello');
    });



}

bootstrap();