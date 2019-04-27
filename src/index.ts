import "reflect-metadata";
//import graphql related imports here

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import * as testStuff from "../utilities/testFile";
const dotenv = require('dotenv');
const { Pool } = require('pg')
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
async function bootstrap() {
    dotenv.config();
    var app: express.Application = express();

    app.use(cors());
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
    console.log(connectionString);
    const pool = new Pool({ connectionString: connectionString});


    app.get('/', (req, res) => {
        res.send('Hello');
    });

    app.post('/register', (req,resx) => {
        console.log('Email: ' + req.body.password);
        var myHeaders = {
            'Content-Type': 'application/json',
            'app_key': process.env.AVIANA_API_KEY
        }
        var data = {
            'email' : req.body.email,
            'password': req.body.password
        }
        axios.post('https://aviana.herokuapp.com/user/signup', data, {headers: myHeaders}).then(
            res => {
                console.log(res.data);
                // console.log(res.data.email);
                // console.log(res.data.success);
                resx.send({some:'got', more: res.data});
            }
        )
        
    });

    app.post('/login',(req,resx) => {
        var myHeaders = {
            'Content-Type': 'application/json',
            'app_key': process.env.AVIANA_API_KEY
        }
        var data = {
            'email' : req.body.email,
            'password': req.body.password
        }
        var tokenHeader;
        axios.post('https://aviana.herokuapp.com/user/signin', data, {headers: myHeaders}).then(res => {
            // console.log(res.data.token);
            tokenHeader = {'accessToken': res.data.token};
            axios.post('https://aviana.herokuapp.com/user/verify', {'accessToken': res.data.token}, {headers: tokenHeader})
            .then(resz => {
                pool.query('SELECT * FROM users WHERE id = $1', [resz.data._id], (err, res) => {
                    if (err) {throw err}
                    console.log('res.rowCount ' + res.rowCount);
                    if(res.rowCount == 0){
                        console.log('inserting user');
                        pool.query('INSERT INTO users(id, email) VALUES ($1, $2)', [resz.data._id, resz.data.email], 
                            (err, res) => {
                                if(err) throw err;
                                console.log('user inserted');
                                resx.send({auth: true, token: tokenHeader.accessToken, email: resz.data.email});
                        })
                    }
                    else{
                        resx.send({auth: true, token: tokenHeader.accessToken, email: resz.data.email});
                    }
                })
                console.log('after data inserted');
            }).catch(err => console.log('error in retrieving user details' + err));
        }).catch(err => console.log('error in getting access token:' + err));
    });

    app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT}`));

}

bootstrap();