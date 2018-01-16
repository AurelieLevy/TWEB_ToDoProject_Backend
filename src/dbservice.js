const mongoose = require('mongoose');
// we active the promises (using bluebird promises library)
mongoose.Promise = require('bluebird');

// On heroku :
//const url = process.env.MONGODB_URI;
// On local docker :
const url = 'mongodb://192.168.99.100/todoproject'

// ---------- SCHEMA AND MODELS ----------
const userSchema = mongoose.Schema({
    wunderlistId:Number,
    gold:Number,
    ownedImages:[{pathId:String}]
});

const User = mongoose.model('User', userSchema);


class DBService {
    constructor() {
        mongoose.connect(url, { useMongoClient: true });
    }

    connect() {
        return mongoose.connection
            .then((database) => {
                this.db = database;
                console.log("connection to db ready");
            })
            .catch((err) => console.log(err));
    }

    createOrGetUserPromise(userId) {
        return User.findOne({wunderlistId:userId})
            .then((user) => {
                if(user == null){
                    // Creating a new user if not exists
                    user = new User({
                        wunderlistId:userId, 
                        gold:0
                    });
                    user.save();
                }
                return user;
            });
    }
}

module.exports = DBService;