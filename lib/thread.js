'use strict';
var nconf = require('nconf');

//var freebase=require('./freebase');
/*var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: nconf.get('twt_consumer_key'),
    consumer_secret: nconf.get('twt_consumer_secret'),
    access_token_key: nconf.get('twt_access_token_key'),
    access_token_secret: nconf.get('twt_access_token_secret')
});*/
nconf.argv().env().file({ file: 'local.json' });
exports.db = JSON.parse(nconf.get('db'));
var dbuser = nconf.get('dbuser');
var dbpass = nconf.get('dbpass');
var dbtype = nconf.get('dbtype');
var dbname = nconf.get('dbname');
var pg = require('pg'),
   conString = 'pg://'+dbuser+':'+dbpass+'@localhost:5432/'+dbname;
   exports.twt = function(callback){
      twit.stream('statuses/filter', {track:'#aguamala'}, function(stream) {
          stream.on('data', function(data) {
              console.log(data.user.profile_image_url+data.user.screen_name+'@'+data.user.text);
              callback(data);
          });
          stream.on('disconnect', function (disconnectMessage) {
              console.log(disconnectMessage);
              stream.start();
           });
      });
   };
   exports.getProfile = function (uname, callback) {
     pg.connect(conString, function(err, client, done) {
      if(err)
        callback(err);
      client.query('SELECT * FROM pjs WHERE (uname like $1)', [uname], function(err, result)
        {
        done();
        if(err)
          callback(err);
        else
          callback(null, result.rows[0]);
        });
      });
   };
   exports.getRooms = function (callback) {
     pg.connect(conString, function(err, client, done) {
       if(err)
         callback(err);
       var threads = [];
       client.query('SELECT name FROM rooms', function(err, result)
         {
         done();
         if(err)
           callback(err);
         else
           if (result.rows.length)
            for (var i=0; i<result.rows.length; i++)
              threads.push({name: result.rows[i].name});
         callback(null, threads);
       });
     });
   };
   exports.signIn = function (data, callback) {
     pg.connect(conString, function(err, client, done) {
       if(err)
         callback(err);
       var res = null;
       client.query('SELECT uname FROM pjs WHERE (email like $1 AND pw like $2)', [data.email, data.pw], function(err, result)
        {
        done();
         if(err)
           callback(err);
         if(result.rowCount)
           res = {
             uname: result.rows[0].uname
             };
         callback(null, res);
       });
     });
   };
   exports.signUp = function (data, callback) {
     pg.connect(conString, function(err, client, done) {
       done();
       if(err)
         callback(err, null);
       client.query('INSERT INTO pjs (email, pw, uname) VALUES ($1, $2, $3)', [data.email, data.pw, data.email], function(err, result)
        {
        console.log(err);
        if(err)
           callback(err, null);
        else
           callback(null, result);
        });
     });
   };
   exports.setMsg = function (msg) {
     pg.connect(conString, function(err, client, done) {
       done();
       if(err)
         console.log(err);
       client.query('INSERT INTO signos (msg, pic, room) VALUES ($1, $2, $3)', [msg.msg, msg.pic, msg.room], function(err, result) {
         if(err)
           console.log(err);
       });
     });
   };
if (exports.db)
   {
   exports.getThread = function (req, callback) {
   pg.connect(conString, function(err, client, done) {
     if(err)
       callback(err, null);
     var threads = [];
     client.query('SELECT * FROM signos WHERE room like $1 ORDER BY idx DESC LIMIT 20', [req.route.params.room], function(err, result)        {
       done();
       if(err)
         callback(err, null);
       if (result.rows.length)
          for (var i=0; i<result.rows.length; i++) {
            if (result.rows[i].pic)
               threads.push({msg: result.rows[i].msg, pic: result.rows[i].pic.toString(), date: result.rows[i].date});
            else
               threads.push({msg: result.rows[i].msg, pic: null, date: result.rows[i].date});
            }
       callback(null, threads);
     });
   });
   };
   }
   else
      {
      console.log('no thread mode (free socket)');//TODO ephemeral
      }