const mongoose = require('mongoose');
// we active the promises (using bluebird promises library)
mongoose.Promise = require('bluebird');

// On heroku :
//const url = process.env.MONGODB_URI;
// On local docker :
const url = 'mongodb://192.168.99.100/todoproject'

// arrays defining images id avaiable;
const images = [
    {imageId:1, value:5},
    {imageId:2, value:20},
    {imageId:3, value:2},
    {imageId:4, value:8},
];

// ---------- SCHEMA AND MODELS ----------
let userSchema = mongoose.Schema({
    wunderlistId: Number,
    gold: Number,
    ownedImages: [{ imageId: String, value: Number }]
});

userSchema.methods.addGold = function (value) {
    this.gold += value;    
}

userSchema.methods.getAvaiableImages = function () {
    // Removing the images already owned from the full list
    // https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
    return images.filter(item => !this.ownedImages.map(i => i.imageId).includes(item));
}

userSchema.methods.buyImage = function (id) {
    if(this.ownedImages.map(i => i.imageId).includes(id))
        return; // Already owned

    // Getting the image
    let image = images.find(i => i.imageId == id);

    if(this.gold < image.value)
        return; // Not enough money

    // Effectively buying the image
    this.gold -= image.value;
    this.ownedImages.push(image);
    console.log(image);
}

// Creating the model
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
        return User.findOne({ wunderlistId: userId })
            .then((user) => {
                if (user == null) {
                    // Creating a new user if not exists
                    user = new User({
                        wunderlistId: userId,
                        gold: 0
                    });
                    user.save();
                }
                return user;
            });
    }
}

module.exports = DBService;