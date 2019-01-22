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

    var app = angular.module('app',['firebase',"ngRoute",'ngResource'])
    .run(function ($rootScope,ItemService) {
      if (!$rootScope.list){
        ItemService.get(function(data){
          $rootScope.list=data;
          $rootScope.$broadcast('serviceInfoReceived')
          console.log("List scope set");
        })
      }
	   });
    const auth = firebase.auth();

    app.controller('mainCtrl',function($location,$window,$firebaseObject,$scope,ItemService,QueryUtil,$rootScope){
      $rootScope.isAdminLogin=false;
      $rootScope.isLoggedIn=false;


      $scope.searchBar = function() {
        console.log($scope.search);
         $location.path('/products/' + $scope.search + '/search');
      }

      $scope.logout_submit = function() {
        firebase.auth().signOut().then(function() {
          console.log('Signed Out');
          $rootScope.isAdminLogin=false;

        }, function(error) {
          console.error('Sign Out Error', error);
        });
      }
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("user is logged in");
          if(user.uid=='7DfyEySxFrPMzxGuiW0sgsl4uQj1'){
            $rootScope.isAdminLogin=true;
          }else{
            $rootScope.isAdminLogin=false;
          }
          $rootScope.isLoggedIn=true;
        } else {
          console.log("No user is logged in");
          $rootScope.isLoggedIn=false;
        }
        $rootScope.$apply();
      });






    })

    app.controller('homeCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil,$rootScope){


    })

    app.controller('productDetailCtrl',function($firebaseObject,$scope,ItemService,QueryUtil,$routeParams,$rootScope){

      if($rootScope){
        $scope.detailItem = QueryUtil.getItemByName($rootScope.list,$routeParams.itemName);
      }else{
        $rootScope.$on("serviceInfoReceived", function(){
           $scope.detailItem = QueryUtil.getItemByName($rootScope.list,$routeParams.itemName);
         });
      }



      $scope.itemEditSumbit = function(){
        console.log("edit");
      }

    })

    app.controller('manageItemCtrl', ['$scope','ItemService', function($scope,ItemService) {
      $scope.uploadStatus='Standing by...';
      console.log(firebase.auth().currentUser);

      $scope.submit = function() {
        $scope.uploadStatus='Uploading...';
        firebase.auth().currentUser.getIdToken().then(function(idToken) {
          $scope.item.token=idToken;
          console.log($scope.item);
          ItemService.save($scope.item,function(res){
            $scope.uploadStatus=res.msg;
          },function(err){
            console.log(err);
          });

          console.log(firebase.auth().currentUser);
          console.log("done");
        }).catch(function(error) {
          console.log(error);
        });


      }
    }])

    app.controller('loginCtrl',function($rootScope,$scope,$window){
      $scope.loginSubmit = function() {
        if($rootScope.isLoggedIn){
          console.log("logged in already, not submitting");
        }else{
          console.log($scope.login.username);
          auth.signInWithEmailAndPassword($scope.login.username,$scope.login.pw)
          .then(function(){
            console.log("login success");
            $rootScope.isLoggedIn=true;
            //$window.location = "#/"
            location.reload();
          }).catch(function(error) {
            // Handle Errors here.

            errorMessage = error.message;
            console.log(error.message);

          });
        }



      }
    })

    app.controller('productsCtrl',function($firebaseObject,$scope,ItemService,QueryUtil,$routeParams,$rootScope){
      if($rootScope){
        if($routeParams.search == "search"){
          $scope.products = QueryUtil.getItemByAny($rootScope.list,$routeParams.brand);
        }else{
          $scope.products = QueryUtil.getItemByBrand($rootScope.list,$routeParams.brand);
        }
      }else{
        $rootScope.$on("serviceInfoReceived", function(){
          if($routeParams.search == "search"){
            $scope.products = QueryUtil.getItemByAny($rootScope.list,$routeParams.brand);
          }else{
            $scope.products = QueryUtil.getItemByBrand($rootScope.list,$routeParams.brand);
          }
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
    .when("/home", {
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
    })
    .when("/products/:brand?/:search?", {
        templateUrl : "./views/products.html",
        controller : "productsCtrl"
    });
  });


}());
