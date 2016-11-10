'use strict';

module.exports = function(Account) {
  Account.getBalance = function(id, cb) {
    Account.findById(id, {include: ['incomes', 'transactions']}, function (err, account) {
      var balance = 0;
      if (account === null) {
        console.log(err);
        cb(null, balance);
        return;
      }
      account.incomes({}, function (err, incomes) {
        incomes.forEach(function(income){
          balance += income.amount;
        });
        account.transactions({}, function(err, transactions) {
          transactions.forEach(function(transaction){
            balance -= transaction.amount;
          });
          cb(null, balance);
        });
      });

    });
  }
  Account.setCoinsToAll = function(amount, cb) {
    Account.find({include: 'incomes'}, function (err, accounts) {
      accounts.forEach(function(account) {
        // post.owner points to the relation method instead of the owner instance
        var a = account.incomes.create({
          accountId: account.id,
          amount: amount,
        });
      });
    });
    cb(null, 'ok');
  }
  Account.setCoinsToOne = function(id, amount, cb) {
    Account.findById(id, {}, function (err, account) {
      var a = account.incomes.create({
        accountId: account.id,
        amount: amount,
      });
    });
    cb(null, 'ok');
  }
  Account.remoteMethod (
    'getBalance',
    {
      http: {path: '/getBalance', verb: 'get'},
      accepts: {arg: 'id', type: 'number', http: { source: 'query' } },
      returns: {arg: 'amount', type: 'string'}
    }
  );
  Account.remoteMethod (
    'setCoinsToAll',
    {
      http: {path: '/setCoinsToAll', verb: 'get'},
      accepts: {arg: 'amount', type: 'number', http: { source: 'query' } },
      returns: {arg: 'status', type: 'string'}
    }
  );
  Account.remoteMethod (
    'setCoinsToOne',
    {
      http: {path: '/setCoinsToOne', verb: 'get'},
      accepts: [
          {arg: 'id', type: 'number', http: { source: 'query' } },
          {arg: 'amount', type: 'number', http: { source: 'query' } },
        ],
      returns: {arg: 'status', type: 'string'}
    }
  );
};
