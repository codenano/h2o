'use strict';

angular.module('h2o', [
  'ngRoute',
  'h2o.factories',
  'h2o.controllers',
  'h2o.directives'
]).
run(function ($rootScope, $http, $location) {
  $rootScope.state = 'loading';
  $rootScope.included = 'loading';
  var host = window.location.hostname;
  $rootScope.app = 'p2';
  $rootScope.socket = new WebSocket('ws://' + host);
}).
config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'aguamala',
      templateUrl: 'partials/aguamala.html'
    })
    .when('/signup', {
      controller: 'aguamala',
      templateUrl: 'partials/signup.html'
    })
    .when('/signin', {
      controller: 'aguamala',
      templateUrl: 'partials/signin.html'
    })
    .when('/module/profile/section/:section', {
      controller: 'profile',
      templateUrl: 'partials/profile.html'
    })
    .when('/module/:module/section/:section', {
      controller: 'app',
      templateUrl: 'partials/app.html'
    })
    .when('/signout', {
      controller: 'app',
      templateUrl: 'partials/app.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});