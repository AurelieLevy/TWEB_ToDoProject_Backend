const mongoose = require('mongoose');
// we active the promises (using bluebird promises library)
mongoose.Promise = require('bluebird');

/**
 * Note: everythings should be promised
 */

let url;
if (process.env.MONGODB_URI != null) // On heroku
    url = process.env.MONGODB_URI;
else // On local docker (windows) if not exists
    url = "mongodb://192.168.99.100/todoproject";


// arrays defining images id available;
const availableImages = [
    { imageId: 1, value: 5 },
    { imageId: 2, value: 20 },
    { imageId: 3, value: 2 },
    { imageId: 4, value: 8 },
];

// ---------- SCHEMA AND MODELS ----------
let userSchema = mongoose.Schema({
    wunderlistId: Number, // The user wunderlist Id
    gold: Number, // The money the user has
    ownedImages: [{ imageId: Number, value: Number }], // The images the user own
    handledTasks:[Number] // The wunderlist taskIds that has been already handled
});

userSchema.methods.addGold = function (value) {
    this.gold += value;
}

userSchema.methods.getAvailableImagesToBuy = function () {
    // Removing the images already owned from the full list
    // https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
    return availableImages.filter(item => !this.ownedImages.map(i => i.imageId).includes(item));
}

userSchema.methods.buyImage = function (id) {
    return new Promise(() => {
        // Getting the image from the list of avaiable images
        let image = availableImages.find(i => i.imageId == id);

        if (this.ownedImages.map(i => i.imageId).includes(id))
            return; // Already owned

        if (this.gold < image.value)
            return; // Not enough money

        // Effectively buying the image
        this.gold -= image.value;
        this.ownedImages.push(image);
        //console.log(image);
    });
}

// Creating the model
const User = mongoose.model('User', userSchema);

// ----------------------------

class DBService {
    constructor() {
        mongoose.connect(url, { useMongoClient: true });
    }

    connect() {
        return mongoose.connection
            .then((database) => {
                this.db = database;
                console.log("connection to db ready");
                
                // Cleaning user 
                return User.remove({});
            })
            .catch((err) => console.log(err));
    }

    createOrGetUser(userId) {
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