const passport = require('passport');
//passport-local will return an object and we
//only needs strategy from it
const {Strategy}  = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');


module.exports = function localStrategy(){
passport.use(new Strategy({
    usernameField:'username',
    passwordField:'password'
}, (username, password, done) => {

    const url ='mongodb+srv://globomantics:globo@globomantics.olcrp.mongodb.net?retryWrites=true&w=majority';

    const dbName ='globomantics';

//we go to db and look up the user, validate the password and create
//a user object out of that
(async function validateUser(){
let client;
try {
    client = await MongoClient.connect(url);
    debug('Connected to the mongo DB');

  //create instance of our mongo database
  const db = client.db(dbName);

  const user =await db.collection('users').findOne({username});

  if(user && user.password === password) {
     done(null, user);
  }else{
     done(null, false);
  }
} catch (error) {
    //we don't have a user
    done(error, false);

};
client.close();
}())

}));

}

