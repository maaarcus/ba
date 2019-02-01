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


    var app = angular.module('app',['firebase',"ngRoute",'ngResource','paypal-button','ngMaterial','ui.filters'])
    .run(function ($rootScope,ItemService) {
      if (!$rootScope.list){
        ItemService.get(function(data){
          $rootScope.list=data;
          $rootScope.$broadcast('serviceInfoReceived')
          console.log("List scope set");
        })
      }


      if(!$rootScope.cart){
        $rootScope.cart=[];
        console.log("cart reset");
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

      function showDefaultImg(ev){
        event.src = "./images/gotop.png";
        event.onerror = '';
      }

    })

    app.filter('range', function() {
      return function(input, total) {
        total = parseInt(total);
        for (var i=1; i<total; i++)
          input.push(i);
        return input;
      };
    });


    app.controller('homeCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil,$rootScope){
      console.log($scope.list);
    })

    app.controller('productDetailCtrl',function($firebaseObject,$scope,ItemService,QueryUtil,$routeParams,$rootScope,$mdDialog){

      if($rootScope.list){
        $scope.detailItem = QueryUtil.getItemByName($rootScope.list,$routeParams.itemName);
      }else{
        $rootScope.$on("serviceInfoReceived", function(){
           $scope.detailItem = QueryUtil.getItemByName($rootScope.list,$routeParams.itemName);
         });
      }



      $scope.itemEditSumbit = function(){
        console.log("edit");
      }

      $scope.addToCartClick = function(ev){
        console.log("addToCartClick");
        if($rootScope.list){
          if(!$rootScope.cart.includes($scope.detailItem)){
            $rootScope.cart.push($scope.detailItem);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#productDetailPage')))
                .clickOutsideToClose(true)
                .title('Success')
                .textContent('Item added to the cart.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(ev)
            );
          }else{
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#productDetailPage')))
                .clickOutsideToClose(true)
                .title('Error')
                .textContent('Already in the cart!')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(ev)
            );
          }
          console.log($rootScope.cart);
        }
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
      var pageStep = 2;
      var pageMaxItem = 4;

      $scope.headItemIndex=0;
      $scope.footItemIndex=pageMaxItem;

      if($rootScope){
        if($routeParams.search == "search"){
          $scope.products = QueryUtil.getItemByAny($rootScope.list,$routeParams.brand);
        }else{
          $scope.products = QueryUtil.getItemByBrand($rootScope.list,$routeParams.brand);
        }
        $scope.maxPages = Math.ceil((Object.keys($scope.products).length)/pageMaxItem)+1;
        console.log("object count1: " + $scope.maxPages);
        console.log("object length: " + Object.keys($scope.products).length);

      }else{
        $rootScope.$on("serviceInfoReceived", function(){
          if($routeParams.search == "search"){
            $scope.products = QueryUtil.getItemByAny($rootScope.list,$routeParams.brand);
          }else{
            $scope.products = QueryUtil.getItemByBrand($rootScope.list,$routeParams.brand);
          }
         });

        $scope.maxPages = Math.ceil((Object.keys($scope.products).length)/pageMaxItem)+1;
         console.log("object count2: " + $scope.maxPages);

      }




      $scope.switchPage = function(page){
        $scope.headItemIndex=(page-1)*pageStep;
        $scope.footItemIndex=(page-1)*pageStep+pageMaxItem;
        // console.log($scope.footItemIndex);
        // console.log($scope.headItemIndex);
      }

    })

    app.controller('cartCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil,$rootScope){
      console.log($rootScope.cart);
      $scope.products=$rootScope.cart;
      $scope.getTotal = function(){
      var total = 0;
      for(var i = 0; i < $scope.cart.length; i++){
          var product = $scope.cart[i];
          total += parseFloat(product.price);
          }
          return total;
      }

      $scope.opts = {

          env: 'sandbox',

          client: {
              sandbox:    'AWi18rxt26-hrueMoPZ0tpGEOJnNT4QkiMQst9pYgaQNAfS1FLFxkxQuiaqRBj1vV5PmgHX_jA_c1ncL',
              production: '<insert production client id>'
          },

          // payment: function() {
          //
          //     var env    = this.props.env;
          //     var client = this.props.client;
          //
          //     return paypal.rest.payment.create(env, client, {
          //         transactions: [
          //             {
          //                 amount: { total: '1.00', currency: 'USD' }
          //             }
          //         ]
          //     });
          // },

          payment: function(data, actions) {
            // 2. Make a request to your server
            payload=JSON.stringify($scope.cart);
            return actions.request.post('/api/create-payment/',{product_id: payload,})
              .then(function(res) {
                // 3. Return res.id from the response
                console.log(res.id);
                return res.id;
              });
          },

          commit: true, // Optional: show a 'Pay Now' button in the checkout flow

          // onAuthorize: function(data, actions) {
          //
          //     // Optional: display a confirmation page here
          //
          //     return actions.payment.execute().then(function() {
          //         // Show a success page to the buyer
          //     });
          // }
          onAuthorize: function(data, actions) {
            // 2. Make a request to your server
            return actions.request.post('/api/execute-payment/', {
              paymentID: data.paymentID,
              payerID:   data.payerID
            })
              .then(function(res) {
                // 3. Show the buyer a confirmation message.
              });
          }
      };

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

    app.directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
              console.log(ngSrc);
              if(!ngSrc){
                element.attr('src', 'themes/images/placeHolder.png')
              }
            });
        }
    };
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
    })
    .when("/cart", {
        templateUrl : "./views/cart.html",
        controller : "cartCtrl"
    })
  });


}());
