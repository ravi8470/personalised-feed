import "reflect-metadata";

import { buildTypeDefsAndResolvers } from "type-graphql";
import TopicResolver from './Resolvers/TopicResolver';
import UserResolver from "./Resolvers/UserResolver";
import ArticleResolver from "./Resolvers/ArticleResolver";
import { makeExecutableSchema } from "graphql-tools";
const graphqlHTTP = require('express-graphql');

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

var myHeaders = {
    'Content-Type': 'application/json',
    'app_key': process.env.AVIANA_API_KEY
}

async function bootstrap(){
    var app: express.Application = express();
    app.use(cors());
    app.options('*', cors())//handling all preflight requests.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname , '../feed-ui/dist')))
    app.use('/graphql', async function (req, res, next) {
        console.log('Request URL:', req.originalUrl);
        if(req.body.token){
            var result: any = await axios.post('https://aviana.herokuapp.com/user/verify', {'accessToken': req.body.token}, {headers: myHeaders}).catch(err =>{
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

    app.all('*', (req,res) => {
        res.sendFile(path.join(__dirname, '../feed-ui/dist', 'index.html'));
    });

    app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT}`));
}
bootstrap(); 


