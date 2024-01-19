const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const { serializeUser } = require("passport")

function initialize(passport){
    // function to authenticate users
    const authenticateUsers = async (email, passport, done) => {
        // get users by email
        const user = getUserByEmail(email)

        if(user == null){
            return done(null, false, {message: "No user found with that email."})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
        }catch(e){
            console.log(e);
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'email'}))
    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
}

module.exports = initialize