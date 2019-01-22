module.exports = function(app,request){
  var CLIENT =
    'AesGuv0kHzzDyce6vEvFfJo9opx-RC9Y9S6o9ssiPvPJ-23wY0rKhb7AG04BphkrfqL5Vs9_3qmtXKw2';
  var SECRET =
    'EPsTHvAN2XWg3XjVhmz5d9BdHTmfT0Og6pv39bnlsN0KyBfww46nGPxYXOArWzgafTR0Hx6TLnQ6Bnpu';
  var PAYPAL_API = 'https://api.sandbox.paypal.com';
  app
    // Set up the payment:
    // 1. Set up a URL to handle requests from the PayPal button
    .post('/api/create-payment/', function(req, res)
    {
      // 2. Call /v1/payments/payment to set up the payment
      request.post(PAYPAL_API + '/v1/payments/payment',
      {
        auth:
        {
          user: CLIENT,
          pass: SECRET
        },
        body:
        {
          intent: 'sale',
          payer:
          {
            payment_method: 'paypal'
          },
          transactions: [
          {
            amount:
            {
              total: '6.99',
              currency: 'USD'
            },
            description: "The payment transaction description. 5.99"
          }],
          redirect_urls:
          {
            return_url: 'https://www.google.com',
            cancel_url: 'https://www.mysite.com'
          }
        },
        json: true
      }, function(err, response)
      {
        if (err)
        {
          console.error(err);
          return res.sendStatus(500);
        }
        // 3. Return the payment ID to the client
        res.json(
        {
          id: response.body.id
        });
      });
    })
    // Execute the payment:
    // 1. Set up a URL to handle requests from the PayPal button.
    .post('/api/execute-payment/', function(req, res)
    {
      // 2. Get the payment ID and the payer ID from the request body.
      var paymentID = req.body.paymentID;
      var payerID = req.body.payerID;
      // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
      request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
        '/execute',
        {
          auth:
          {
            user: CLIENT,
            pass: SECRET
          },
          body:
          {
            payer_id: payerID
            // payment_id: paymentID
            // transactions: [
            // {
            //   amount:
            //   {
            //     total: '10.99',
            //     currency: 'USD'
            //   },
            //   description: "The payment transaction description. 10.99"
            // }]
          },
          json: true
        },
        function(err, response)
        {
          if (err)
          {
            console.error(err);
            return res.sendStatus(500);
          }
          // 4. Return a success response to the client
          res.json(
          {
            status: 'success'
          });
        });
    }).listen(3000, function()
    {
      console.log('Server listening at http://localhost:3000/');
    });
  // Run `node ./server.js` in your terminal
}
