import express, {Router} from "express";
const userController = require('../controllers/userController');
const path = require('path');

const router: Router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../feed-ui/dist', 'index.html'));
});

router.post('/register', async (req, res) => {
    var result = await userController.registerUser(req.body.email, req.body.password);
    console.log('result in register router' + result);
    res.send(result);
});

router.post('/login', async(req, res) => {
    var result = await userController.loginUser(req.body.email, req.body.password);
    console.log('sending response:' + result);
    res.send(result);
});

module.exports = router;