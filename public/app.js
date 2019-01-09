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

    app.controller('mainCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil){
      // const rootRef = firebase.database().ref().child('items');
      // const ref = rootRef.child('marui');
      ItemService.get(function(data){
        $scope.list=data;
        $window.sessionStorage.setItem("allitems",JSON.stringify(data));
        //console.log(JSON.parse($window.sessionStorage.getItem("allitems")));
      })

    })

    app.controller('productDetailCtrl',function($firebaseObject,$scope,ItemService,DataStorage,QueryUtil,$routeParams){

      ItemService.get(function(data){
        $scope.params = $routeParams;
        $scope.detailItem = QueryUtil.getItemByName(data,$routeParams.itemName);
      })



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

    app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller : "mainCtrl"
    })
    .when("/items/:itemName", {
        templateUrl : "product_detail.html",
        controller : "productDetailCtrl"
    })
    .when("/green", {
        templateUrl : "green.htm"
    })
    .when("/blue", {
        templateUrl : "blue.htm"
    });
  });


}());
