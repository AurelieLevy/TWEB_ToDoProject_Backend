const DBService = require('./dbservice');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

class ToDoProjectService {
    constructor() {
        this.dbService = new DBService();
        this.isConnected = false;
    }

    connect() {
        return this.dbService.connect();
    }

    computeScore(task) {
        let dueDate = new Date(task.due_date);
        let completedDate = new Date(task.completed_at);

        // Computing score

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
        return this.dbService.createOrGetUser()
            .then((user) => {
                // Getting the unhandled tasks
                let unhandledTasks = completedTasks
                    .filter((t) => !user.handledTasks.includes(t.id));

                // computing scores
                let score = unhandledTasks.reduce((score, t1) => score + this.computeScore(t1), 0);

                user.addGold(score);

                // Adding to handled tasks
                user.handledTasks.push(...unhandledTasks.map(t => t.id));

                // saving the user 
                return user.save().then(() => { return user; });
            });
    }

    buyImage(userId, imageId) {
        return this.dbService.createOrGetUser()
            .then((user) => {
                user.buyImage(imageId);

                // saving the user 
                return user.save().then(() => { return user; });
            });
    }

    getUserInfo(userId) {
        return this.dbService.createOrGetUser(userId)
            .then(u => {
                return {
                    gold: u.gold,
                    ownedImages: u.ownedImages,
                    availableImagesToBuy: u.getAvailableImagesToBuy()
                }
            });
    }



}

module.exports = ToDoProjectService;