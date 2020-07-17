const rp = require('request-promise');
var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
var config = require('./config.json');




const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
 
const poolData = {
    UserPoolId:config.cognito.userPoolId,
    ClientId:config.cognito.clientId
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



router.get('/',function(req,res){
    res.render('index');
});
router.get('/signup',function(req,res){
    res.render('signup');
});
router.post('/signup',function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;


    if(password!=confirm_password){
       return  res.redirect('/signup',{error:"Password not match!"})
    }

    // const emailData ={
    //     Name:'email',
    //     Value:email
    // };

    
    // const emailAttribute = new AmazonCongnitoIdentity.CognitoUserAttribute(emailData);

    var attributeList = [];
    attributeList.push(new    AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));

    userPool.signUp(email,password,attributeList,null,(err,data)=>{
       
        if(err){
            console.log(err);
        }
        res.render('home',{user:data.user});
    })

});

router.get('/signin',function(req,res){
    res.render('signin');
});
router.post('/signin',function(req,res){
    const loginDetails = {
        Username :req.body.email,
        Password:req.body.password
    }
    const authenticationDetails = new AmazonCongnitoIdentity.AuthenticationDetails(loginDetails);

    const userDetails ={
        Username:req.body.email,
        Pool :userPool
    }

    const cognitoUser = new AmazonCongnitoIdentity.CognitoUser(userDetails);
    cognitoUser.authenticateUser(authenticationDetails,{
        onSuccess:data=>{
        
            res.redirect('/home');
        },
        onFailure:error=>{
            console.log(error)
            res.redirect('/signin');
        }
    })

});

module.exports = router;