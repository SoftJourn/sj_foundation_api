

module.exports = function(app) {
  var AccountModel = app.models.Account;
  var AccountAccessToken = app.models.AccountAccessToken;
  // var auth = ;
  app.use('/admin', require('./routes/admin')(app));
  app.use('/api', require('./routes/auth')(app));
  app.use('/api/projects', require('./routes/projects')(app))
  app.use('/api/categories', require('./routes/categoreies')(app))
  app.use('/api/comments', require('./routes/comments')(app))


  // app.get('*', function(req, res) {
  //   res.render('foundation');
  // });
};