# ToDo project

This project was done as part of the TWEB course of HEIG-VD (Yverdon, Switzerland).

Wunderlist is an application offering ToDo lists and provides an API allowing developers to link it with their own application. You can find it <a href="https://developer.wunderlist.com/documentation">Here</a>. 

It is downloadable for Mac, Windows, Android and iOS <a href="https://www.wunderlist.com/fr/download/">here</a>.

This project is a gamification of the use of Wunderlist. When you finished a task, you win more or less coins, allowing you to buy images. The project is separate into two application : A frontend client made using angularjs and a server.

## Server

The server make the link between the Wunderlist API and the client. The client will first log himself with his credentials to wunderlist and then make requests by using the server API endpoints and a code given by wunderlist. 

His information will be saved in a mangoose database by the server.

![Sequence diagram](https://github.com/remij1/TWEB_ToDoProject/blob/master/Authentification.png)

### Database

In this database, you have a schema representing a user. The attributs saved are:

    1. The user wunderlist Id (Number)
    2. The money (gold) the user has (Number)
    3. The images the user own ({ imageId: Number, value: Number })
    4. The wunderlist taskIds that has been already handled (Number)
	
## Client

The frontend was made by using AngularJS, Yeoman and Grunt.

AngularJS allow use to create a Single-Page Applications. As we spoke before, there are two modules: ```My Photos``` and ```Shop```.

## How to use our client

First, you will need to download Wunderlist and register an account. Be careful to remember your credentials, you will need them in our application.

Once you did this, you can go <a href="https://remij1.github.io/#!/dashboard">here</a> where you will have two tabs : 

- **My photos** that will show you the pictures you have already bought and the tasks you completed
- **Shop** is the shop where you will be able to buy others pictures.

To connect yourself, you just need to click on the ```Login``` button in the pop-up, enter your credentials in the login page of wunderlist and it's done. After that, you will find your name and the amount of gold you have earned at the top of your client page.

## Links 

- <a href="https://remij1.github.io/">Client</a> example on github-pages
- <a href="https://github.com/remij1/TWEB_ToDoProject_Backend">Server</a> on github
- <a href="https://github.com/remij1/remij1.github.io">Client</a> code
