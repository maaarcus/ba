module.exports = {
    mapProductCheckout: function(json) {
        console.log("helper class here");
        console.log(json);

        var items = [];

        json=JSON.parse(json);

        for(var i in json) {

            var item = json[i];

            items.push({
                "name" : item.name,
                "description": item.description,
                "price"  : item.price,
                "quantity": item.quantity,
                "currency": 'USD'
            });
        }

        console.log("items is now: " + items);
        return items
    },

    getTotalCheckout: function(jsonObject){
      var sum = 0;
      for(var i in jsonObject){
        var item = jsonObject[i];
        sum += parseInt(item.price)*item.quantity;
        // console.log("looped: " + i);
      }
      console.log("the total is: " + sum);
      return sum;
    },

    validateWithDB: function(dbObject,json){
      var dbSum = 0;
      var cartSum = 0;
      jsonObject=JSON.parse(json);
      for(var i in jsonObject){
        var item = jsonObject[i];
        console.log("validate looped: " + i);
        try{
          var dbitem = dbObject[item.product_code]
          console.log("prodcut code: " + item.product_code);
          console.log("dbprice: "+ dbitem.price + " itemPrice: "+item.price);
          cartSum += parseInt(item.price)*item.quantity;
          dbSum += parseInt(dbitem.price)*item.quantity;
          if (dbitem.price != item.price){
            console.log("Price not matched");
            return false;
          }else{
            console.log("Price matched");
          }
        }catch(error){
          console.log("no such product code in db");
          console.log(error);
        }
      }

      if (dbSum != cartSum){
        console.log("dbsum: " + dbSum + " cartSum: " + cartSum);
        return false;
      }else{
        console.log("dbsum: " + dbSum + " cartSum: " + cartSum);
        return true;
      }



    },

    // validateWithDB: async function(ref){
    //   ref.on("value", function(snapshot) {
    //     console.log(snapshot.val());
    //     return snapshot.val();
    //   }, function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    //   });
    // }

    // isWithinRange(text, min, max) {
    //     // check if text is between min and max length
    // }
}
