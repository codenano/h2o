'use strict';
angular.module('h2o.aguamala', []).
  controller('aguamala', function ($rootScope, $scope, $location, $http, $routeParams){
     $scope.module = $routeParams.module;
     $scope.section = $routeParams.section;
     $scope.validateEmail = function(email, callback) {
       var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       callback(re.test(email));
       };
     $scope.validatePssw = function(pssw, callback) {
       callback((pssw.length >= 8));
       };
     $scope.init = function(){
       $rootScope.start = false;
       $rootScope.loading();
       $('.panel').css({ transform: 'rotate(0deg)'});
       switch($location.path()) {
                     case '/signup':
                       document.getElementById('singup_email').focus();
                       $scope.singup_email_v = false;
                       $scope.singup_pssw_v = false;
                       $scope.signUp = function() {
                          var user_data = {
                              email: $scope.singup_email.value,
                              pw: $scope.singup_pssw.value,
                              type: 'signUp'
                              };
                          $rootScope.loading();
                          $rootScope.socket.send(JSON.stringify(user_data));
                          };
                       $scope.keyMail = function() {
                           $scope.singup_email_v = false;
                           $scope.singup_email = document.getElementById('singup_email');
                           $scope.user_signup = document.getElementById('user_signup');
                           $scope.validateEmail($scope.singup_email.value.toString(), function(res){
                             if (res)
                                {
                                $scope.singup_email.parentNode.childNodes[1].innerHTML = 'Email valido';
                                $scope.singup_email.parentNode.className = 'form-group has-success';
                                $scope.singup_email_v = true;
                                }
                                else
                                   {
                                   $scope.singup_email.parentNode.childNodes[1].innerHTML = 'Email no valido';
                                   $scope.singup_email.parentNode.className = 'form-group has-error';
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
                       $scope.keyPssw = function() {
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
                     break;
                     case '/signin':
                       document.getElementById('singin_email').focus();
                       $scope.singin_email_v = false;
                       $scope.singin_pssw_v = false;
                       $scope.signIn = function() {
                          var user_data = {
                            email: $scope.singin_email.value,
                            pw: $scope.singin_pssw.value,
                            type: 'signIn'
                            };
                          $rootScope.loading();
                          $rootScope.socket.send(JSON.stringify(user_data));
                          };
                       $scope.keyMail = function() {
                           $scope.singin_email_v = false;
                           $scope.singin_email = document.getElementById('singin_email');
                           $scope.user_signin = document.getElementById('user_signin');
                           $scope.validateEmail($scope.singin_email.value.toString(), function(res){
                             if (res)
                                {
                                $scope.singin_email.parentNode.childNodes[1].innerHTML = 'Email valido';
                                $scope.singin_email.parentNode.className = 'form-group has-success';
                                $scope.singin_email_v = true;
                                }
                                else
                                   {
                                   $scope.singin_email.parentNode.childNodes[1].innerHTML = 'Email no valido';
                                   $scope.singin_email.parentNode.className = 'form-group has-error';
                                   }
                             if ($scope.singin_pssw_v && $scope.singin_email_v)
                                {
                                $scope.user_signin.disabled = false;
                                }
                                else
                                   {
                                   $scope.user_signin.disabled = true;
                                   }
                             });
                          };
                       $scope.keyPssw = function() {
                           $scope.singin_pssw_v = false;
                           $scope.singin_pssw = document.getElementById('singin_pssw');
                           $scope.user_signin = document.getElementById('user_signin');
                           $scope.validatePssw($scope.singin_pssw.value.toString(), function(res){
                             if (res)
                                {
                                $scope.singin_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña valida';
                                $scope.singin_pssw.parentNode.className = 'form-group has-success';
                                $scope.singin_pssw_v = true;
                                }
                                else
                                   {
                                   $scope.singin_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña no valida';
                                   $scope.singin_pssw.parentNode.className = 'form-group has-error';
                                   }
                             if ($scope.singin_pssw_v && $scope.singin_email_v)
                                {
                                $scope.user_signin.disabled = false;
                                }
                                else
                                   {
                                   $scope.user_signin.disabled = true;
                                   }
                             });
                          };
                     break;
                     case '/':
                        console.log('here');
                        $('#calendar').calendar({events_source: function(){
    return  [
       {
           "id": 293,
           "title": "Event 1",
           "url": "http://example.com",
           "class": "event-important",
           "start": 12039485678000,
           "end": 1234576967000
       }
   ];
}});
                     break;
                     default:
                       console.log($location.path());
                     break;
                     }
				};
     $scope.intervalLoad = setInterval(function(){
       if ($rootScope.state === 'start') {
          clearInterval($scope.intervalLoad);
          $scope.init();
          //$rootScope.loading();
          }
       },100);
    });