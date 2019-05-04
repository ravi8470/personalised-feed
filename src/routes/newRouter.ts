import express, {Router} from "express";


const routerp: Router = express.Router();

routerp.get('/ss', (req, res) => {
    res.send('hello from router pppppppppp');
});

module.exports = routerp;