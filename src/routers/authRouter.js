
const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
// create user
const{username, password} =req.body;
const url ='mongodb+srv://globomantics:globo@globomantics.olcrp.mongodb.net?retryWrites=true&w=majority';

const dbName ='globomantics';

(async function addUser(){
    let client;
    try {

    client = await MongoClient.connect(url);
    debug('Connected to the mongo DB');
    const db = client.db(dbName);
    const user = {username, password};
    //create a user collection and login user
    const results = await db.collection('users').insertOne(user);
    debug(results);
    //login takes the user we have and creates the user on the cookie
    req.login(results.ops[0], ()=>{
        res.redirect('/auth/profile');
    });

    } catch (error) {
        debug(error)
    }

 client.close();


})();


});

authRouter.route('/signIn').get((req, res)=>{
res.render('signin');
})
.post(passport.authenticate('local', {
   sucessRedirect:'/auth/profile',
   failureMessage:'/'
}));

authRouter.route('/profile').get((req, res) => {
res.json(req.user);
})


module.exports = authRouter;