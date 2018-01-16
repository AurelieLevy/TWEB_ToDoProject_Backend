const DBService = require('./dbservice');

const service = new DBService();

service.connect()
    .then(() =>  service.createOrGetUserPromise(145))
    .then((user) => {
        console.log(user);
    });
