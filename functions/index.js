const functions = require('firebase-functions');
const express = require('express');
var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyBv8I-qaYHgD2HgaAj3CdC7nGJsGbPndDI",
  authDomain: "boomairsoft-b2e78.firebaseapp.com",
  databaseURL: "https://boomairsoft-b2e78.firebaseio.com",
  projectId: "boomairsoft-b2e78",
  storageBucket: "boomairsoft-b2e78.appspot.com",
  messagingSenderId: "998878149034"
};
firebase.initializeApp(config);

const app = express();

app.get('/api/items',(request,response)=>{
  var itemsCountRef = firebase.database().ref().child('items');
  itemsCountRef.on('value', function(snapshot) {
    console.log(snapshot.val());
    response.send(snapshot.val());
    // response.send(request.params.id);
  });
});

app.get('/api/items/:id',(request,response)=>{
  var itemsCountRef = firebase.database().ref().child('items/marui');
  itemsCountRef.orderByChild("name").equalTo("HK416").on("child_added", function(snapshot) {
    console.log(snapshot.key);
  });
  response.send(request.params.id);
});



exports.app = functions.https.onRequest(app);
