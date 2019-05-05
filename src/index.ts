import "reflect-metadata";
//import graphql related imports here
import { buildTypeDefsAndResolvers } from "type-graphql";
import TopicResolver from './Resolvers/TopicResolver';
import { makeExecutableSchema } from "graphql-tools";

import express from "express";
const graphqlHTTP = require('express-graphql');
import cors from "cors";
import bodyParser from "body-parser";
const util = require('util');
import axios from "axios";
import * as testStuff from "../utilities/testFile";
import UserResolver from "./Resolvers/UserResolver";
import ArticleResolver from "./Resolvers/ArticleResolver";
const routerp = require("./routes/newRouter");
const dotenv = require('dotenv');
const { populateArticles } = require('./tasks/serverTasks');


dotenv.config();

var myHeaders = {
    'Content-Type': 'application/json',
    'app_key': process.env.AVIANA_API_KEY
}

async function bootstrap(){
    setInterval(populateArticles, 3*60*60*1000);
    var app: express.Application = express();
    app.use(cors());
    app.options('*', cors())//handling all preflight requests.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
     
    app.use('/graphql', async function (req, res, next) {
        console.log('Request URL:', req.originalUrl);
        if(req.body.token){
            var result = await axios.post('https://aviana.herokuapp.com/user/verify', {'accessToken': req.body.token}, {headers: myHeaders}).catch(err =>{
                console.log('error occurred:' + err);
                res.send({error: err});
            });
            if(result.data._id){
                req.body.id = result.data._id;
                req.body.email = result.data.email;
                console.log(req.body.id);
                next();
            }
            else{
                res.send({error: 'Session has expired, Please re-login.'});
            }
        }
        else{
            res.send({error:'Error in authentication Server.'});
        }
        
    });

    const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: [TopicResolver, UserResolver, ArticleResolver],
    });

    
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    
    

    app.use('/', require("./routes/authRouter"));

    app.use('/graphql', graphqlHTTP((req: any) =>({
        schema: schema,
        graphiql: true,
        context: {
            id: req.body.id
        }
    })));

    app.use('/user', routerp);
    app.all('*', (req,res) => {
        res.send("<h1>404 - Not Found </h1>");
    });


    app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT}`));
}
bootstrap(); 


