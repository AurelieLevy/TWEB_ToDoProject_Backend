
/*
const DBService = require('./dbservice');

const service = new DBService();

service.connect()
    .then(() =>  service.createOrGetUser(145))
    .then((user) => {
        //console.log(user);
        user.addGold(50);
        let u = user.getAvailableImagesToBuy();
        //console.log(u);
        console.log(user.ownedImages);
        user.buyImage(1);
        console.log(user.ownedImages);
    });
//*/

const ToDoProjectService = require('./todoprojectservice');
const service = new ToDoProjectService();

service.connect()
    .then(() => {
        return service.updateUser(3212, [
            {
                id: 8483632,
                "due_date": "2018-08-30", 
                "completed_at": "2018-08-20T08:36:13.273Z",

            },
            {
                id: 12338122,
                "due_date": "2018-08-30", 
                "completed_at": "2018-08-22T08:36:13.273Z",

            }
        ])
    }).then(() => {
        return service.buyImage(3212, 1);
    }).then(() => {
        return service.getUserInfo(3212);
    }).then((userInfo) =>{
        //console.log("tada");
        console.log(userInfo);
    });