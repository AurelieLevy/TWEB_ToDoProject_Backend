const mongoose = require('mongoose');
// we active the promises (using bluebird promises library)
mongoose.Promise = require('bluebird');

// On heroku :
//const url = process.env.MONGODB_URI;
// On local docker :
const url = 'mongodb://192.168.99.100/'

class DB {
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

    getUser(userId) {
        this.db
    }
}

module.exports = DB;