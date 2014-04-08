'use strict';

angular.module('h2o.factories', []).
  factory('auth',function($rootScope, $http, $location, $window) {
    var login = function (uname) {
          $rootScope.isAuthenticated = true;
          $rootScope.uname = uname;
          //console.log($rootScope.heartbeats+':'+$rootScope.state+'@'+uname);
          window.location.href = '/';
       };
    var logout = function() {
       var log = {
         type: 'signOut',
         uname: $rootScope.uname
         };
       $rootScope.socket.send(JSON.stringify(log));
       $rootScope.isAuthenticated = false;
       $rootScope.uname = 'alien';
       window.location.href = '/signout';
       };
       return {
         login: login,
         logout: logout
       };
  });