const passport = require('passport')
require('./strategies/local.strategy')()



module.exports = function passportConfig(app){
app.use(passport.initialize());
app.use(passport.session());

//we serialize the entire user object
passport.serializeUser((user, done )=>{
     done(null, user);
});

//deserializing a user coming out of cookie
passport.deserializeUser((user, done)=>{
done(null, user);
})
}