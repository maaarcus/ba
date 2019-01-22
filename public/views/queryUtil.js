angular.module('app')
  .factory('QueryUtil', [ 'ItemService',function (ItemService,$rootScope) {


    return {
      getItemByName: function (data,itemName) {
        return _.find(data,function(itemObject) {
          return itemObject.name == itemName
        })
      },
      getItemByBrand: function (data,brand) {
        if (brand == "all"){
          return data
        }else{
          return _.where(data,{ brand: brand})
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

      }
    }
}]);
