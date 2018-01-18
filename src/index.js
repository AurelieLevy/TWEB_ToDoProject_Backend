//endpoints:
/*

1) connexion
POST /accessToken
{
    code: 'bla'
}

format réponse: 
{
    token
}

2) obtenir les info user (points, nom, info de profil, etc... a voir ce qu'on affiche)
GET /userInfo
Header: x-access-token

format réponse: {
    id,
    nom
}



3) obtenir les images achetables
GET /images?filter=buyable
Header: x-access-token

format réponse:[
    {idImage1, valeur, url},
    {idImage2, valeur, url},
    ...
]


4) obtenir les images déjà achetées
GET /images?filter=owned
Header: x-access-token

format réponse:[
    {idImage1, valeur, url},
    {idImage2, valeur, url},
    ...
]

5) achat image précise
POST /images/idImage
Header: x-access-token
{
    "idImage":<nombre>
}

format réponse:
{
    idImage, valeur, url
}

//Recuperation de toutes les taches finies d'un user
GET /taches
Header: x-access-token

format réponse:
{
    "id": 3372483925,
    "created_at": "2017-12-10T19:42:46.686Z",
    "created_by_id": 77670624,
    "created_by_request_id": "16aab5bba3589ff71989:nEOJbegAAAA=:cdf8c718-5fec-4ba0-9192-d9889c5e7817:77670624:4926",
    "due_date": "2017-12-17",
    "completed": true,
    "completed_at": "2017-12-17T08:57:06.835Z",
    "completed_by_id": 77670624,
    "starred": true,
    "list_id": 321144246,
    "revision": 7,
    "title": "NOEL avec potos",
    "type": "task"
}
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var WunderlistSDK = require('wunderlist');
var wunderlistInfo = require('../ressources/wunderlist_info.json');

const ToDoProjectService = require('./todoprojectservice');
const service = new ToDoProjectService();


var rp = require('request-promise');

app.set('port', (process.env.PORT || 5000));

service.connect()
    .then(() => {
        app.listen(app.get('port'), function () {
            console.log('Node app is running on port', app.get('port'));
        });
    });

//endpoint pour connexion
app.post('/access_token', function (req, res) {
    var code = req.body.code;
    console.log("Code recu: " + code)
    var options = {
        method: 'POST',
        uri: 'https://www.wunderlist.com/oauth/access_token',
        body: {
            "client_id": wunderlistInfo.client_id,
            "client_secret": wunderlistInfo.client_secret,
            "code": code
        },
        json: true
    };
    rp(options)
        .then(function (parsedBody) {
            console.log("accessToken sended to wunderlist API");
            console.log("Token: " + parsedBody.access_token);
            res.json(parsedBody);//renvoie au client
            console.log("Code sended to the client")
        })
        .catch(function (err) {
            console.log("POST to get token to wunderlist API failed");
        });
});

//endpoint pour info user
app.get('/user_info', function (req, res) {
    var token = req.headers['x-access-token'];
    console.log("token: " + token)
    getWunderlistUserWithGold(token)
        .then(jsonToSend => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(jsonToSend));
            console.log("User infos sended to the client");
        });

});

app.get('/images', function (req, res) {
    var token = req.headers['x-access-token'];
    if (req.query.filter == "buyable") {
        //endpoint pour obtenir images achetable
        console.log("Asking paid images received");
        getWunderlistUser(token)
            .then(user => {
                return service.getUserInfo(user.id);
            }).then(tabImages => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(tabImages.availableImagesToBuy));
            });;

    }
    else if (req.query.filter == "owned") {
        //endpoint pour obtenir images deja achetees
        console.log("Asking solded images received");
        getWunderlistUser(token)
            .then(user => {
                return service.getUserInfo(user.id);
            }).then(tabImages => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(tabImages.ownedImages));
            });
    }
});

//endpoint pour achat image precise
app.post('/images/:idImage', function (req, res) {
    var token = req.headers['x-access-token'];
    var imageId = req.params.idImage;
    console.log("ID of the image to paid: " + imageId);
    getWunderlistUser(token)
        .then(user => {
            return service.buyImage(user.userId, imageId);
        });
});

//endpoint pour obtenir toutes les taches terminees de l'utilisateur
app.get('/tasks', function (req, res) {
    var token = req.headers['x-access-token'];
    var arrayCompletedTasks = [];
    var promisesArray = [];
    getAllListsByWunderlist(token)
        .then(lists => {
            for (var i = 0; i < lists.length; i++) {
                promisesArray.push(getCompletedTasksOfAList(lists[i])
                    .then((list) => {
                        arrayCompletedTasks.push(list);
                    }));
            }
            Promise.all(promisesArray)
                .then(() => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(arrayCompletedTasks));
                });
            console.log("get completed tasks");
        });
});

function getAllListsByWunderlist(token) {
    var wunderlistAPI = new WunderlistSDK({
        'accessToken': token,
        'clientID': wunderlistInfo.client_id
    });
    return new Promise((resolve, reject) => {
        wunderlistAPI.http.lists.all()
            .done(function (lists) {
                resolve(lists);
            })
            .fail(function () {
                console.error("Problem with wunderlistApi function getAllListsByWunderlist");
            });
    });
}

function getCompletedTasksOfAList(list) {
    var listId = list.id;
    var completed = true;
    var wunderlistAPI = new WunderlistSDK({
        'completed': true,
        'list_id': listId
    });
    return new Promise((resolve, reject) => {
        wunderlistAPI.http.tasks.forList(listId, completed)
            .done(function (tasks, statusCode) {
                resolve(tasks);
            })
            .fail(function () {
                console.error("Problem with getCompletedTasksOfAList");
            });
    });
}

function getWunderlistUser(token) {

    var wunderlistAPI = new WunderlistSDK({
        'accessToken': token,
        'clientID': wunderlistInfo.client_id
    });
    return new Promise((resolve, reject) => {
        wunderlistAPI.http.user.all()
            .done(function (lists) {
                var userId = lists.id;
                var userName = lists.name;
                var jsonToSend = {
                    'userId': userId,
                    'userName': userName,
                };
                resolve(jsonToSend);
            })
            .fail(function () {
                console.error("Problem with getWunderlistUser");
            });
    });

}

function getWunderlistUserWithGold(token) {
    let u;
    console.log("getWunderlistUserWithGold")
    return getWunderlistUser(token)
        .then((wunderlistUser) => {
            u = wunderlistUser;
            return service.getUserInfo(wunderlistUser.userId);
        }).then(userInfo => {
            u.gold = userInfo.gold;
            return u;
        })
}

/*function getUserId(token) {
    return new Promise((resolve, reject) => {
        getUserInformations(token)
            .then(jsonInfo => {
                resolve(jsonInfo.userId);
            });
    });

}*/

