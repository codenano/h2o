'use strict';
module.exports = function(app, express, sessionStore) {

var thread = require('./thread');
var mail = require('./mail');
var _ = require('underscore');
var wss = require('ws').Server;
var nconf = require('nconf');
var clientsWS = [];
var roomsNS = [];
var roomsWS = [];

var cookieParser = express.cookieParser(nconf.get('session_secret'));

exports.isLoggedIn = function(req, res, next){
 if (!req.session.uname) {
    req.session.uname = 'alien';
    }
 next();
};

exports.start = function(app, server, callback){
  exports.room = new wss({server: server});
  exports.thread = thread;
  exports.server = server;
  /*if (exports.thread.db)
     thread.twt(function(data){
       var murls = [];
       if (data.entities.media)
         _.each(data.entities.media, function(m){
            murls.push(m.media_url);
           });
       var res = {
         murls: murls,
         profile_pic: data.user.profile_image_url,
         user: data.user.screen_name,
         msg: data.text
       };
       var log = {
         response: res,
         type: 'twt_up'
       };
       _.each(clientsWS, function(client){
             client.send(JSON.stringify(log));
             });
     });*/
  exports.room.on('connection', function(ws) {
    //process.memoryUsage()
    //console.log((0/0+"").repeat("7")+ "!");
    ws.on('close', function() {
        _.map(roomsNS, function(key, value){
          roomsWS[key] = _.reject(roomsWS, function(client){
              return (client == ws)
              });
        });
        clientsWS = _.reject(clientsWS, function(client){
              return (client == ws)
              });
        });
    ws.on('message', function(data){
    var data = JSON.parse(data);
    switch (data.type) {
        case 'getProfile':
          console.log('getting profile from: '+data.uname);
           if (thread.db)
              thread.getProfile(data.uname, function(err, res){
                if (err) {
                   var log = {
                   type: 'profile_fail',
                   response: err
                   };
                   ws.send(JSON.stringify(log));
                   }
                   else
                      {
                      var log = {
                      type: 'profile_data',
                      response: res
                      };
                      ws.send(JSON.stringify(log));
                      }
                console.log(res);
              });
           _.each(roomsWS[data.room], function(client){
                client.send(JSON.stringify(data));
              });
        break;
        case 'meat':
           console.log(data.msg+':'+data.fingerprint+'@'+data.room);
           if (thread.db)
              thread.setMsg(data);
           _.each(roomsWS[data.room], function(client){
                client.send(JSON.stringify(data));
              });
        break;
        case 'join':
            if (!(_.find(roomsNS, function(room){return room === data.room}))) {
               roomsNS.push(data.room);
               roomsWS[data.room] = [];
               }
            roomsWS[data.room].push(ws);
        break;
        case 'leave':
            roomsWS[data.room] = _.reject(roomsWS[data.room], function(client){
              return (client === ws)
              });
            if (roomsWS[data.room].length === 0)
               roomsNS = _.reject(roomsNS, function(room){
                 return (room === data.room)
                 });
        break;
        case 'start':
          cookieParser(ws.upgradeReq, null, function(err) {
            var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
            sessionStore.get(sessionID, function(err, sess) {
             switch(sess.uname) {
               case 'alien':
                 var menu =
                       [
                        {
                          name: 'Us',
                          icon: 'comments-o',
                          url:'/module/us/section/main'
                        }
                       ];
               break;
               default:
                 var menu =
                       [
                        {
                          name:'Messages',
                          icon: 'comments-o',
                          url:'/module/contact/section/main'
                        }
                       ];
               break;
               }
              var log = {
                type: 'start',
                app: data.app,
                menu: menu,
                uname: sess.uname,
                sid: sessionID
                };
              ws.send(JSON.stringify(log));
            });
          });
        break;
        case 'sendMail':
          mail.send(data.client, data.msg);
        break;
        case 'signOut':
          var log = {
             type: 'sign_out',
             uname: data.uname
             };
          console.log(log);
          _.each(clientsWS, function(client){
              client.send(JSON.stringify(log));
              });
        break;
        case 'signUp':
          thread.signUp(data, function(err, res){
          if (err) {
             var log = {
             type: 'sign_up_fail',
             response: err
             };
             ws.send(JSON.stringify(log));
             }
             else
                {
                cookieParser(ws.upgradeReq, null, function(err) {
                   var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
                   sessionStore.get(sessionID, function(err, sess) {
                            sess.uname = data.email;
                            sessionStore.set(sessionID, sess, function(err, sess) {
                              var log = {
                                type: 'sign_up_ok',
                                response: data.email,
                                sid: sessionID
                                };
                              _.each(clientsWS, function(client){
                                  client.send(JSON.stringify(log));
                                  });
                              mail.send(data.email, data.pw);
                            });
                          });
                       });
                }
              });
        break;
        case 'ping':
          var log = {
            app: data.app,
            type: 'pong'
            };
          ws.send(JSON.stringify(log));
        break;
        case 'signIn':
          thread.signIn(data, function(err, user){
          if (err)
             {
             var log = {
                 type: 'sign_in_fail',
                 response: 'error'
                 };
             ws.send(JSON.stringify(log));
             console.log(err);
             }
             else
                {
                if (user) {
                    cookieParser(ws.upgradeReq, null, function(err) {
                      var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
                      console.log(sessionID);
                      sessionStore.get(sessionID, function(err, sess) {
                        sess.uname = user.uname;
                        sessionStore.set(sessionID, sess, function(err, sess) {
                          console.log(sess);
                          var log = {
                              type: 'sign_in_ok',
                              response: user.uname,
                              sid: sessionID
                              };
                          _.each(clientsWS, function(client){
                              client.send(JSON.stringify(log));
                              });
                        });
                      });
                    });
                    }
                    else
                       {
                       var log = {
                           type: 'sign_in_fail',
                           response: 'Datos incorrectos'
                           };
                       ws.send(JSON.stringify(log));
                       }
                }
            });
        break;
        }
       });
  clientsWS.push(ws);
  });
callback();
};

return exports;
};