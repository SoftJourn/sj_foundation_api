var request = require('request');
var express = require('express')
var router = express.Router();

module.exports = function(app) {
  var AccountModel = app.models.Account;
  var AccountAccessToken = app.models.AccountAccessToken;

  router.get('/login', function (req, res) {
    res.render('login');
  });

  router.post('/login', function(req, res) {

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
        AccountModel.findOne({
          "where": {
            "email": userCredentials.username+'@softjourn.com',
          }
        }, function(err, user) {
          if(user) {
            user.createAccessToken(
              3333,
              function(err, token) {
                var newToken = {
                  id: token.id,
                  access_token: info.access_token,
                  refreshToken: info.refresh_token,
                  ttl: info.expires_in,
                  accountId: user.id,
                };
                AccountAccessToken.create(newToken, function(err, token){
                  if (err) {
                    console.log(err);
                  }
                  res.cookie('X-Access-Token', token.id);
                  res.json(user);
                });

              });
          } else {

          }
        });
      } else {
        console.log(err);
      }
    });
  });

  return router;

}
