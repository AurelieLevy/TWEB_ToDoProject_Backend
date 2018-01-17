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
GET /images?filter=solded
Header: x-access-token

format réponse:[
    {idImage1, valeur, url},
    {idImage2, valeur, url},
    ...
]


4) obtenir les images déjà achetées
GET /images?filter=paid
Header: x-access-token

format réponse:[
    {idImage1, valeur, url},
    {idImage2, valeur, url},
    ...
]

5) achat image précise
POST /images/idImage
Header: x-access-token

format réponse:
{
    idImage, valeur, url
}
*/

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var WunderlistSDK = require('wunderlist');
/*var wunderlistAPI = new WunderlistSDK({
  'accessToken': 'a user access_token',
  'clientID': 'your client_id'
});*/

var wunderlistInfo = require('../ressources/wunderlist_info.json');

var rp = require('request-promise');

app.set('port', (process.env.PORT || 5000));



//endpoint pour connexion
app.post('/accessToken', function (req, res) {
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
        })
        .catch(function (err) {
            console.log("POST to get token to wunderlist API failed");
        });
});

//endpoint pour info user
app.get('/userInfo', function (req, res) {
    var token = req.headers['x-access-token'];
    console.log("token: " + token)
    var wunderlistAPI = new WunderlistSDK({
        'accessToken': token,
        'clientID': wunderlistInfo.client_id
    });
    //wunderlistAPI.http.lists.all()
    wunderlistAPI.http.user.all()
    .done(function (lists){
        //DO STUFF
        var userId = lists.id;
        var userName = lists.name;
        var jsonToSend = {
            'userId': userId,
            'userName': userName
        };
        res.json(jsonToSend);
        console.log(lists.id);
    })
    .fail(function (){
        console.error("Problem with wunderlistApi /userInfo");
    });
});

//endpoint pour obtenir images achetables
app.get('/images?filter=solded', function (req, res) {

});
//endpoint pour obtenir images deja achetees
app.get('/images?filter=paid', function (req, res) {

});
//endpoint pour achat image precise
app.get('/images/idImage', function (req, res) {

});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
