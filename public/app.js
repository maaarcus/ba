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
    const auth = firebase.auth();

    app.controller('mainCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil){
      $scope.logout_submit = function() {
        firebase.auth().signOut().then(function() {
          console.log('Signed Out');
        }, function(error) {
          console.error('Sign Out Error', error);
        });
      }

    })

    app.controller('homeCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil){
      // const rootRef = firebase.database().ref().child('items');
      // const ref = rootRef.child('marui');
      ItemService.get(function(data){
        $scope.list=data;
        $window.sessionStorage.setItem("allitems",JSON.stringify(data));
        //console.log(JSON.parse($window.sessionStorage.getItem("allitems")));
      })

    })

    app.controller('productDetailCtrl',function($firebaseObject,$scope,ItemService,QueryUtil,$routeParams){

      ItemService.get(function(data){
        $scope.params = $routeParams;
        $scope.detailItem = QueryUtil.getItemByName(data,$routeParams.itemName);
      })
    })

    app.controller('manageItemCtrl', ['$scope','ItemService', function($scope,ItemService) {
      $scope.list = [];
      console.log(firebase.auth().currentUser);

      $scope.submit = function() {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          $scope.item.token=idToken;
          console.log($scope.item);
          ItemService.save($scope.item);
          console.log(firebase.auth().currentUser);
          console.log("done");
        }).catch(function(error) {
          console.log(error);
        });


      }
    }])

    app.controller('loginCtrl',function($scope){
      $scope.loginSubmit = function() {
        console.log($scope.login.username);
        auth.signInWithEmailAndPassword($scope.login.username,$scope.login.pw)
        .then(function(){
          console.log("login success");
          location.reload();
        }).catch(function(error) {
          // Handle Errors here.

          errorMessage = error.message;
          console.log(error.message);

        });

      }
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
        templateUrl : "./views/home.html",
        controller : "homeCtrl"
    })
    .when("/items/:itemName", {
        templateUrl : "./views/product_detail.html",
        controller : "productDetailCtrl"
    })
    .when("/manageItem", {
        templateUrl : "./views/manage_items.html",
        controller : "manageItemCtrl"
    })
    .when("/login", {
        templateUrl : "./views/login.html",
        controller : "loginCtrl"
    });
  });


}());
