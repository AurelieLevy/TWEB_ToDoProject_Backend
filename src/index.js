const DBService = require('./dbservice');

const service = new DBService();

service.connect()
    .then(() =>  service.createOrGetUserPromise(145))
    .then((user) => {
        //console.log(user);
        user.addGold(50);
        let u = user.getAvaiableImages();
        //console.log(u);
        console.log(user.ownedImages);
        user.buyImage(1);
        console.log(user.ownedImages);
    });
