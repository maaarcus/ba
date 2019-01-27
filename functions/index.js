const functions = require('firebase-functions');
const express = require('express');
var firebase = require("firebase");
var request = require('request');

// var config = {
//   apiKey: "AIzaSyBv8I-qaYHgD2HgaAj3CdC7nGJsGbPndDI",
//   authDomain: "boomairsoft-b2e78.firebaseapp.com",
//   databaseURL: "https://boomairsoft-b2e78.firebaseio.com",
//   projectId: "boomairsoft-b2e78",
//   storageBucket: "boomairsoft-b2e78.appspot.com",
//   messagingSenderId: "998878149034"
// };
// firebase.initializeApp(config);

//admin
var admin = require("firebase-admin");

var serviceAccount = require("./onrchu.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://boomairsoft-b2e78.firebaseio.com"
});

var db = admin.database();
var ref = db.ref('items');

//end

const app = express();
var helper = require('./helper.js');
require('./payment')(app,request,helper,ref);
// var itemsCountRef = firebase.database().ref().child('items/marui');

app.get('/api/items',(request,response)=>{
  // itemsCountRef = firebase.database().ref().child('items');
  ref.once('value', function(snapshot) {
    console.log(snapshot.val());
    response.send(snapshot.val());
    // response.send(request.params.id);
  });
});

// app.get('/api/items/:id',(request,response)=>{
//   itemsCountRef = firebase.database().ref().child('items/marui');
//   itemsCountRef.orderByChild("name").equalTo("HK416").on("child_added", function(snapshot) {
//     console.log(snapshot.key);
//   });
//   response.send(request.params.id);
// });

app.post('/api/items',(request,response)=>{
  console.log(request.body.token);
  admin.auth().verifyIdToken(request.body.token)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    console.log("User is: " + uid);
    if (uid == '7DfyEySxFrPMzxGuiW0sgsl4uQj1'){
      ref.push({
        name: request.body.name,
        brand: request.body.brand,
        image: request.body.image,
        description: request.body.description,
        price: request.body.price
      })
      console.log(request.body.name);
      response.send({msg: "Update success"});
    }else{
      console.log("not authenticated");
      response.send({msg: "not authenticated"});
    }
  }).catch(function(error) {
    console.log(error);
  });
});



exports.app = functions.https.onRequest(app);
