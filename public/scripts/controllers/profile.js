'use strict';
angular.module('h2o.profile', []).
  controller('profile', function ($rootScope, $scope, $location, $http, $routeParams){
     $scope.module = $routeParams.module;
     $scope.section = $routeParams.section;
     $scope.validatekeyMinLen = function(pssw, callback) {
       callback((pssw.length >= 8));
       };
     $scope.keyMinLen = function() {
         $scope.singup_pssw_v = false;
         $scope.singup_pssw = document.getElementById('singup_pssw');
         $scope.user_signup = document.getElementById('user_signup');
         $scope.validatePssw($scope.singup_pssw.value.toString(), function(res){
           if (res)
              {
              $scope.singup_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña valida';
              $scope.singup_pssw.parentNode.className = 'form-group has-success';
              $scope.singup_pssw_v = true;
              }
              else
                 {
                 $scope.singup_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña no valida';
                 $scope.singup_pssw.parentNode.className = 'form-group has-error';
                 }
           if ($scope.singup_pssw_v && $scope.singup_email_v)
              {
              $scope.user_signup.disabled = false;
              }
              else
                 {
                 $scope.user_signup.disabled = true;
                 }
           });
        };
     $scope.init = function(){
        /*console.log('load profile:'+$rootScope.uname);
        $rootScope.start = false;
        $rootScope.loading();
        $('.panel').css({ transform: 'rotate(0deg)'});*/
        //$scope.appPanel = document.getElementById('appPanelBody');
        var log = {
          type: 'getProfile',
          uname: $rootScope.uname
          };
        $rootScope.loading();
        $rootScope.socket.send(JSON.stringify(log));
				};
     $scope.intervalLoad = setInterval(function(){
       if ($rootScope.state === 'start') {
          clearInterval($scope.intervalLoad);
          $scope.init();
          }
       },100);
  });