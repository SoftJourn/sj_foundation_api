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
            "email": getEmailByUsername(userCredentials.username),
          }
        }, function(err, user) {
          if(user) {
            createToken(user, info).then(function(token) {
              res.cookie('X-Access-Token', token.id);
              res.json({user, token});
            }).catch(function(error) {
              res.cookie('X-Access-Token', error.id);
              res.json({user, token: error});
            });
          } else {
            createUser(AccountModel, userCredentials).then(function(user) {
              createToken(user, info).then(function(token) {
                res.cookie('X-Access-Token', token.id);
                res.json({user, token});
              })
            });
          }
        });
      } else {
        console.log(err);
      }
    });
  });

  function getEmailByUsername(username) {
    return username+'@softjourn.com';
  }


  function createUser(AccountModel, userCredentials) {
    return new Promise(function(resolve, reject){
      AccountModel.create({
        email: getEmailByUsername(userCredentials.username),
        password: userCredentials.password
      }, function(err, account) {
        if (err) {
          reject(err);
          return;
        }
        resolve(account);
      });
    });
  }

  function createToken(user, info) {
    return new Promise(function(resolve, reject){
      user.createAccessToken(
        33339999,
        function(err, token) {
          if (err) {
            resolve(err);
            return;
          }
          var newToken = {
            id: token.id,
            access_token: info.access_token,
            refreshToken: info.refresh_token,
            ttl: 99999999,
            accountId: user.id,
          };
          AccountAccessToken.update(newToken, function(err, token){
            if (err) {
              reject(newToken);
              return;
            }
            resolve(token);
          });
        });
    });
  }

  return router;

};
