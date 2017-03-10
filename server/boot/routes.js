var request = require('request');

module.exports = function(app) {
  //get User model from the express app
  var AccountModel = app.models.Account;
  var AccountAccessToken = app.models.AccountAccessToken;

  app.get('/api/login', function (req, res) {
    res.render('login');
  });

  app.post('/api/login', function(req, res) {

    //parse user credentials from request body
    const userCredentials = {
      username: req.body.username,
      password: req.body.password
    };


    var options = {
      url: 'https://sjcoins-testing.softjourn.if.ua/auth/oauth/token',
      method: 'POST',
      form: {
        username: userCredentials.username,
        password: userCredentials.password,
        grant_type: 'password'
      },
      headers: {
        'Authorization': 'Basic dXNlcl9jcmVkOnN1cGVyc2VjcmV0'
      }
    };

    request(options, function(error, response, body) {
      if (!error) {
        var info = JSON.parse(body);
        console.log(info);
        AccountModel.findOne({
          "where": {
            "email": userCredentials.username+'@softjourn.com',
          }
        }, function(err, user) {
          if(user) {
            // user.createAccessToken(
            //   3333,
            //   function(err, token) {
            //     console.log(err);
            //     console.log(token);
            //     token.create({id: token.id, access_token: info.accessToken, refreshToken: info.refresh_token, ttl: info.expires_in});
            //       res.json(token);
            //   });
            AccountAccessToken.create(
              {id: info.access_token, accessToken: info.access_token, refreshToken: info.refresh_token, ttl: info.expires_in*100, accountId: user.id},
              function(err, token){
                console.log(err)
                console.log(token)
            });
          } else {
            // AccountModel.create({'username': 'dfitsak', 'email': 'asd@asd2', 'password': 'abc'}, function (err, user) {
            //   if (err) {
            //     console.log(err);
            //   }
            //   user.createAccessToken(5000, function(err, token) {
            //     res.json({
            //       "token": token.id,
            //       "ttl": token.ttl,
            //       'user': 'new user',
            //     });
            //   })
            // });
          }
        });
      } else {
        console.log(err);
      }
    });
  });
};