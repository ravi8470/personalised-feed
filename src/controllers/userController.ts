const dotenv = require('dotenv');
import axios from "axios";
const util = require('util')
const pool = require('../Pool');

dotenv.config();


var myHeaders = {
    'Content-Type': 'application/json',
    'app_key': process.env.AVIANA_API_KEY
}
exports.registerUser = async function(email: string, password: string){    
    var data = {
        'email' : email,
        'password': password
    }
    var result;
    await axios.post('https://aviana.herokuapp.com/user/signup', data, {headers: myHeaders}).then(
       async (res) => {
            console.log(res.data);
            if(res.data.response == 'User already exists'){
                result = {Success: false, error: "User already exists"}
            }
            else{
                // result = await this.loginUser(email,password);
                // console.log('returning result from reguster');
                result = {Success: 'User Registered Successfully, Login to continue.', error: false}
            }
            
        }
    )
    return result;
}

exports.loginUser = async function(email: string, password: string){
    console.log('login called');
    var data = {
        'email' : email,
        'password': password
    }
    var jwtToken: string;
    var result;
    var flag1 = 0;
    var result1: any = await axios.post('https://aviana.herokuapp.com/user/signin', data, {headers: myHeaders}).catch(err =>{
        console.log("error occurred" + err);
        flag1 = 1;
    });
    if(flag1 == 1){ return { auth: false,error: "Invalid Credentials"};}
    console.log('resul1' + result1);
    // console.log(util.inspect(result1, {showHidden: false, depth: null}))
    jwtToken = result1.data.token;
    console.log(jwtToken);
    var flag2 = 0; 
    var result2: any = await axios.post('https://aviana.herokuapp.com/user/verify', {'accessToken': jwtToken}, {headers: myHeaders}).catch(err =>{
        console.log("error occurred" + err);
        flag2 = 1;
    });
    if(flag2 == 1){ return { auth: false,error: "Error in verifying user"};}
    console.log('resul2' + result2);
    // console.log(util.inspect(result2, {showHidden: false, depth: null}))
    // console.dir(result2);
    console.log(result2.data._id);
    var flag3 = 0;
    var result3: any;  
    await pool.query('SELECT * FROM users WHERE id = $1', [result2.data._id]).then((res :any) => {console.log('res.data for select *'); result3 = res;}).catch((err: any) =>{
        console.log("error occurred" + err);
        flag3 = 1;
    });
    if(flag3 == 1){ return { auth: false,error: "Server Error"};}
    console.log('resul3' + result3);
    // console.log(util.inspect(result3, {showHidden: false, depth: null}))
    console.log('res.rowCount ' + result3.rowCount);
    var flag4 = 0;
    if(result3.rowCount == 0){
        console.log('inserting user');
        var result4 = await pool.query('INSERT INTO users(id, email) VALUES ($1, $2)', [result2.data._id, result2.data.email]).catch((err: any) => {console.log(err); flag4 = 1;});
        if(flag4 == 1){ return { auth: false,error: "Server Error"};}
        console.log('resul4' + result4);
        // console.log(util.inspect(result4, {showHidden: false, depth: null}))
    }
    result = {auth: true, token: jwtToken, email: email};
    console.log('after data inserted');
    // result = {auth: false, msg: 'error in retrieving user details'};   
    // result = {auth: false, msg: 'error in getting access token'};
    console.log('returning from login');
    return result;
}