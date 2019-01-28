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
                "quantity": '1',
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
        sum += parseInt(item.price);
      }
      console.log("the total is: " + sum);
      return sum;
    },

    validateWithDB: async function(ref){
      ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }

    // isWithinRange(text, min, max) {
    //     // check if text is between min and max length
    // }
}
