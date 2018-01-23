const DB = require('./db');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

class ToDoProjectService {
    constructor() {
        this.db = new DB();
        this.isConnected = false;
    }

    connect() {
        return this.db.connect();
        this.isConnected = true;
    }

    computeScore(task) {
        // There is not necessary a due date
        if (task.due_date == null || task.completed_at == null)
            return 0;


        let dueDate = new Date(task.due_date);
        let completedDate = new Date(task.completed_at);

        // Computing score
        //console.log(dueDate);
        //console.log(completedDate);

        // Difference between 2 date
        // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
        let utc1 = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        let utc2 = Date.UTC(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());

        let days = Math.floor((utc1 - utc2) / MS_PER_DAY);

        //console.log(days);

        let score = days * 2;
        if (score < 0)
            score = 0;
        return score;
    }

    updateUser(userId, completedTasks) {
        return this.db.createOrGetUser(userId)
            .then((user) => {
                // Getting the unhandled tasks
                let unhandledTasks = completedTasks
                    .filter((t) => !user.handledTasks.map(t => t.id).includes(t.id));

                // computing scores
                let score = unhandledTasks.reduce((score, t1) => score + this.computeScore(t1), 0);

                user.addGold(score);

                // Adding to handled tasks
                user.handledTasks.push(...unhandledTasks
                    .map(t => {
                        return {
                            title: t.title,
                            id: t.id,
                            completed_at: t.completed_at,
                            due_date: t.due_date,
                            score: this.computeScore(t)
                        }
                    }).filter(t => t.score > 0));

                //console.log(user);
                // saving the user 
                return user.save();
            });
    }

    /* getAvailableImageById(userId, imageId) {
         return this.db.createOrGetUser(userId)
             .then((user) => {
                 console.log(user.getAAvailableImageById(imageId));
                 return user.getAAvailableImageById(imageId);
             });
     }*/


    buyImage(userId, imageId) {
        console.log("Achat en court");
        return this.db.createOrGetUser(userId)
            .then((user) => {
                return user.buyImage(imageId)
            }).then((user) => {
                console.log("user: " + user);
                return user.save();
            });
    }



    getUserInfo(userId) {
        return this.db.createOrGetUser(userId)
            .then(u => { // Making it client-specific
                let cleanedImages = [];
                u.ownedImages.forEach(i => {
                    cleanedImages.push({
                        value: i.value,
                        imageId: i.imageId
                    });
                });

                //console.log(u);

                return {
                    gold: u.gold,
                    ownedImages: cleanedImages,
                    availableImagesToBuy: u.getAvailableImagesToBuy(),
                    handledTasks: u.handledTasks
                }
            });
    }



}

module.exports = ToDoProjectService;