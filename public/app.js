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

    var app = angular.module('app',['firebase',"ngRoute",'ngResource']);

    app.controller('mainCtrl',function($firebaseObject,$scope,ItemService){
      // const rootRef = firebase.database().ref().child('items');
      // const ref = rootRef.child('marui');
      ItemService.get(function(data){
        // console.log(data);
        // console.log($firebaseObject(ref));
        // var syncObject = $firebaseObject(ref);
        $scope.list=data;
      })

    })

    app.controller('redCtrl',function($firebaseObject,$scope,ItemService,$routeParams){
      $scope.params = $routeParams;
      // ItemService.get(function(data){
      //   var syncObject = $firebaseObject(ref);
      //   $scope.list=data;
      // })

    })

    app.directive('flexslider', function () {

      return {
        link: function (scope, element, attrs) {

          element.flexslider({
            animation: "fade",
            slideshowSpeed: 4000,
            animationSpeed: 600,
            controlNav: false,
            directionNav: true,
            controlsContainer: ".flex-container" // the container that holds the flexslider
          });
        }
      }
    });

    app.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller : "mainCtrl"
    })
    .when("/red/:itemName", {
        templateUrl : "red.html",
        controller : "redCtrl"
    })
    .when("/green", {
        templateUrl : "green.htm"
    })
    .when("/blue", {
        templateUrl : "blue.htm"
    });
    $locationProvider.html5Mode(true);
  });


}());
