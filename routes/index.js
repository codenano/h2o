'use strict';
module.exports = function (app, h2o) {
  //dependencies
  app.get('/', h2o.isLoggedIn, function (req, res) {
    //console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress);
       res.render('app');
  });
  app.get('/signup', h2o.isLoggedIn, function (req, res) {
    if (req.session.uname == 'alien')
       res.render('app');
    else
       res.redirect('/');
  });
  app.get('/signout', h2o.isLoggedIn, function (req, res) {
    req.session.uname = 'alien';
    res.redirect('/');
  });
  app.get('/signin', h2o.isLoggedIn, function (req, res) {
    console.log(req.session.uname);
    if (req.session.uname === 'alien')
       res.render('app');
    else
       res.redirect('/');
  });
  app.get('/module/:module/section/:section', h2o.isLoggedIn, function (req, res) {
    if (req.session.uname == 'alien')
       res.redirect('/');
    else
       res.render('app');
  });
  app.get('/ip', h2o.isLoggedIn, function (req, res) {
    /*res.json({
      ip: req.ip
    });*/
  });
  //api
  app.get('/api/rooms', h2o.isLoggedIn, function (req, res) {
    /*res.json({
      rooms: rooms
    });*/
  });
  app.get('/api/signos/:room', h2o.isLoggedIn, function (req, res) {
    /*if (h2o.thread.db)
    h2o.thread.getThread(req, function(err, threads){
    if (err) {
    res.status(400);
        res.json({
          message: err.toString()
        });
        } else {
           res.json({
                threads: threads
              });
          }
       });
    else
      res.json({
      threads: []
      });*/
  });
};
