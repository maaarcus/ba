  (function() {

    var config = {
      apiKey: "AIzaSyBv8I-qaYHgD2HgaAj3CdC7nGJsGbPndDI",
      authDomain: "boomairsoft-b2e78.firebaseapp.com",
      databaseURL: "https://boomairsoft-b2e78.firebaseio.com",
      projectId: "boomairsoft-b2e78",
      storageBucket: "boomairsoft-b2e78.appspot.com",
      messagingSenderId: "998878149034"
    };
    firebase.initializeApp(config);

    const myApp = angular.module('app',['firebase']);

    myApp.controller('MyCtrl',function($firebaseObject,$scope){
      const rootRef = firebase.database().ref().child('items');
      const ref = rootRef.child('marui');

      var syncObject = $firebaseObject(ref);
      $scope.list=syncObject;
      console.log($scope.list);


    })

  }());
