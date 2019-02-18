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
          delete data.$promise
          delete data.$resolved
          data = JSON.parse(angular.toJson(data));
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

      $scope.validator = function(evt) {
        var theEvent = evt || window.event;

        // Handle paste
        if (theEvent.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
        // Handle key press
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }
        var regex = /[0-9]|\./;
        if( !regex.test(key) ) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
      }


      $scope.searchBar = function() {
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
      // console.log($scope.list);
    })

    app.controller('productDetailCtrl',function($firebaseObject,$scope,ItemService,QueryUtil,$routeParams,$rootScope,$mdDialog){
      $scope.quantity=1;
      if($rootScope.list){
        $scope.detailItem = QueryUtil.getItemByCode($rootScope.list,$routeParams.product_code);
        $scope.similarProducts=QueryUtil.getItemByBrandinSimilarProducts($rootScope.list,$scope.detailItem.brand,$scope.detailItem.name);
        $scope.randomItem=QueryUtil.getRandomItem($rootScope.list);
        // console.log($scope.randomItem);
      }else{
        $rootScope.$on("serviceInfoReceived", function(){
           $scope.detailItem = QueryUtil.getItemByCode($rootScope.list,$routeParams.product_code);
           $scope.similarProducts=QueryUtil.getItemByBrandinSimilarProducts($rootScope.list,$scope.detailItem.brand,$scope.detailItem.name);
           $scope.randomItem=QueryUtil.getRandomItem($rootScope.list);
           // console.log($scope.randomItem);
         });
      }




      $scope.itemDeleteSumbit = function(){
        firebase.auth().currentUser.getIdToken().then(function(idToken) {
          var payload={product_code: $scope.detailItem.product_code, token: idToken, deleteOperation: true}
            ItemService.save(payload,function(res){
              $scope.uploadStatus=res.msg;
              location.reload();
            },function(err){
              console.log(err);
            });
        })
      }



      $scope.addToCartClick = function(ev){
        console.log("addToCartClick");
        if($rootScope.list){
          if(!$rootScope.cart.includes($scope.detailItem)){
            // $rootScope.cart.push($scope.detailItem);
            QueryUtil.addToCartWithQty($rootScope.cart,$scope.detailItem,$scope.quantity);
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
            QueryUtil.updateCartQty($rootScope.cart,$scope.detailItem,$scope.quantity);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#productDetailPage')))
                .clickOutsideToClose(true)
                .title('Cart Updated')
                .textContent('Quantity updated successfully!')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(ev)
            );
          }
          console.log($rootScope.cart);
        }
      }

    })

    app.controller('manageItemCtrl', ['$rootScope','$scope','ItemService','$routeParams','QueryUtil', function($rootScope,$scope,ItemService,$routeParams,QueryUtil) {
      var storgaeRef = firebase.storage().ref('/items');
      var selectedFile;
      $scope.catagories = [
        'Airsoft guns',
        'Parts',
        'Accessories'
      ];
      $scope.item={brand:"",product_code:""}
      $scope.item.availability=true;
      $scope.item.catagory = $scope.catagories[0]

      if($routeParams.product_code){
        var selectedEditItem=QueryUtil.getItemByCode($rootScope.list,$routeParams.product_code)
        $scope.item.brand=selectedEditItem.brand;
        $scope.item.name=selectedEditItem.name;
        $scope.item.product_code=selectedEditItem.product_code;
        $scope.item.catagory=selectedEditItem.catagory;
        $scope.item.description=selectedEditItem.description;
        $scope.item.price=selectedEditItem.price;
        $scope.item.availability=selectedEditItem.availability;
      }

      $scope.uploadStatus='Standing by...';

      console.log(firebase.auth().currentUser);



      // $scope.item.catagory=$scope.catagories[0];

      $("#file").on("change", function(event){
        selectedFile = event.target.files[0];
      })

      $scope.submit = function() {
        $scope.uploadStatus='Uploading...';
        firebase.auth().currentUser.getIdToken().then(function(idToken) {
          $scope.item.token=idToken;
          if(selectedFile){
          var uploadTask = firebase.storage().ref('items/' + selectedFile.name).put(selectedFile);
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              // console.log('File available at', downloadURL);
              $scope.item.image=downloadURL;
              ItemService.save($scope.item,function(res){
                $scope.uploadStatus=res.msg;
                location.reload();
              },function(err){
                console.log(err);
              });
            });
          });
        }else{
          ItemService.save($scope.item,function(res){
            $scope.uploadStatus=res.msg;
            location.reload();
          },function(err){
            console.log(err);
          });
          console.log("not updating image");
        }
        }).catch(function(error) {
          $scope.uploadStatus="Error occurs. Have you attached an image?"
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
      var pageMaxItem = 12;
      $scope.currentPage=1;
      $scope.headItemIndex=0;
      $scope.footItemIndex=pageMaxItem;

      var loadProducts = function() {
        if($routeParams.search == "search"){
          $scope.products = QueryUtil.getItemByAny($rootScope.list,$routeParams.brand);
        }else{
          $scope.products = QueryUtil.getItemByCatagory($rootScope.list,$routeParams.catagory);
          // console.log($routeParams.catagory);
          if($routeParams.brand){
            $scope.products = QueryUtil.getItemByBrand($scope.products,$routeParams.brand);
          }
        }
        $scope.maxPages = Math.ceil((Object.keys($scope.products).length)/pageMaxItem)+1;
      }


      if($rootScope.list){
        loadProducts();
      }else{
        $rootScope.$on("serviceInfoReceived", function(){
          if($routeParams.search == "search"){
            loadProducts();
          }
         });



      }


      $scope.prevNextPage = function(command){
        command=parseInt(command);
        if ( command == "prev" && command > 0 ){
          $scope.currentPage=$scope.currentPage-1;
        }else if( command == "next" && command >= $scope.maxPages){
          $scope.currentPage=$scope.currentPage+1;
        }


      }

      $scope.switchPage = function(page){

        $scope.headItemIndex=(page-1)*pageStep;
        $scope.footItemIndex=(page-1)*pageStep+pageMaxItem;
        $scope.currentPage=page;

      }

    })

    app.controller('cartCtrl',function($window,$firebaseObject,$scope,ItemService,QueryUtil,$rootScope,$mdDialog){
      $scope.products=$rootScope.cart;
      $scope.getTotal = function(){
      var total = 0;
      for(var i = 0; i < $scope.cart.length; i++){
          var product = $scope.cart[i];
          total += parseFloat(product.price)*product.quantity;
          }
          return total;
      }

      $scope.removeFromCart = function(item_product_code){
        var cart = $rootScope.cart;
        var itemIndex = cart.map(function(d) { return d['product_code']; }).indexOf(item_product_code)
        cart.splice(itemIndex,1);
        console.log($rootScope.cart);
        console.log(cart);
      }

      $scope.opts = {

          env: 'sandbox',

          client: {
              sandbox:    'AWi18rxt26-hrueMoPZ0tpGEOJnNT4QkiMQst9pYgaQNAfS1FLFxkxQuiaqRBj1vV5PmgHX_jA_c1ncL',
              production: '<insert production client id>'
          },

          payment: function(data, actions) {
            // 2. Make a request to your server
            payload=JSON.stringify($scope.cart);
            return actions.request.post('/api/create-payment/',{cart_items: payload,})
              .then(function(res) {
                // 3. Return res.id from the response

                return res.id;
              })
              .catch(function(error){
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#cartPage')))
                    .clickOutsideToClose(true)
                    .title('Something went wrong')
                    .textContent('Try refreshing the website with Ctrl + F5 please.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
                // alert("Something went wrong. Try refreshing the website with Ctrl + F5 please.")
              });
          },

          commit: true, // Optional: show a 'Pay Now' button in the checkout flow


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
    app.directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);

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
    .when("/items/:product_code", {
        templateUrl : "./views/product_detail.html",
        controller : "productDetailCtrl"
    })
    .when("/manageItem/:product_code?", {
        templateUrl : "./views/manage_items.html",
        controller : "manageItemCtrl"
    })
    .when("/login", {
        templateUrl : "./views/login.html",
        controller : "loginCtrl"
    })
    // .when("/products/:brand?/:search?", {
    //     templateUrl : "./views/products.html",
    //     controller : "productsCtrl"
    // })
    .when("/products/catagory/:catagory?", {
        templateUrl : "./views/products.html",
        controller : "productsCtrl"
    })
    .when("/products/catagory/:catagory?/brand/:brand?", {
        templateUrl : "./views/products.html",
        controller : "productsCtrl"
    })
    .when("/products/:brand?/:search?", {
        templateUrl : "./views/products.html",
        controller : "productsCtrl"
    })
    .when("/cart", {
        templateUrl : "./views/cart.html",
        controller : "cartCtrl"
    })
    .when("/contact_us", {
        templateUrl : "./views/contact_us.html"
    })
  });


}());
