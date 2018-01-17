//endpoints:
/*

1) connexion
POST /accessToken
{
    code
}

format réponse: 
{
    token
}

2) obtenir les info user (points, nom, info de profil, etc... a voir ce qu'on affiche)
GET /userInfo
Header: token

format réponse: {
    id,
    nom
}



3) obtenir les images achetables
GET /images?filter=solded
Header: token

format réponse:[
    {idImage1, valeur, url},
    {idImage2, valeur, url},
    ...
]


4) obtenir les images déjà achetées
GET /images?filter=paid
Header: token

format réponse:[
    {idImage1, valeur, url},
    {idImage2, valeur, url},
    ...
]

5) achat image précise
POST /images/idImage
Header: token

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


app.set('port', (process.env.PORT || 5000));



//endpoint pour connexion
app.post('/accessToken', function (req, res) {
    var code = req.body.code;
    
});

//endpoint pour info user
app.get('/userInfo', function (req, res) {

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
