angular.module('app')
  .factory('QueryUtil', [ 'ItemService',function (ItemService,$rootScope) {


    return {
      getItemByName: function (data,itemName) {
        var result = _.find(data,function(itemObject) {
          console.log("itemObject.name: " + itemObject.name);
          console.log("itemName: " + itemName);
          return itemObject.name == itemName
        })
        return result;
      },
      getItemByCode: function (data,itemcode) {
        var result = _.find(data,function(itemObject) {
          return itemObject.product_code == itemcode
        })
        return result;
      },
      getItemByBrand: function (data,brand) {
        if (brand == "all"){
          delete data.$promise
          delete data.__proto__
          return data
        }else{
          return _.where(data,{ brand: brand})
        }
      },
      getItemByCatagory: function (data,catagory) {

          return _.where(data,{ catagory: catagory})

      },
      getItemByBrandinSimilarProducts: function (data,brand,nameOfitemToExclude) {
        if (brand == "all"){
          delete data.$promise
          delete data.__proto__
          return data
        }else{
          var result = _.where(data,{ brand: brand})
          result =  _.without(result, _.findWhere(result, {
            name: nameOfitemToExclude
          }));
          return result
        }
      },
      getItemByAny: function (data,query) {
        // return _.filter(data,function(item){
        var result = []
        query=query.toLowerCase();
        var queryArray=query.split(" ");
        queryArray.forEach(function(element){
          var exp=new RegExp(element);
          // return exp.test(item.name) || exp.test(item.brand)
          result=result.concat(_.filter(data,function(item){
            if (item.name && item.brand){
              if(result.includes(item)){
                // console.log("duplicated, aborting");
                return false;
              }
              var itemName=item.name.toLowerCase();
              var itemBrand=item.brand.toLowerCase();
            }
            return exp.test(itemName) || exp.test(itemBrand)
          })
        )
        })

        return result;

      },
      getRandomItem: function (data){

        var obj_keys = Object.keys(data);
        var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        // console.log(ran_key);
        return data[ran_key];
      },
      addToCartWithQty: function (cart,selectedItem,qty){
        console.log(qty);
        selectedItem.quantity=qty;
        cart.push(selectedItem);
      },
      updateCartQty: function (cart,selectedItem,qty){
        var selectedItemInCart = _.find(cart,function(item){
          return item.product_code == selectedItem.product_code
        })
        if(selectedItemInCart){
          selectedItemInCart.quantity=qty;
        }else{
          console.log("Unexpected error: the item cannot be found in the cart");
        }
      },
      copy: function (obj) {
      	return JSON.parse(JSON.stringify(obj));
      }
    }
}]);
