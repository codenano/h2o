'use strict';

angular.module('h2o.controllers', [
   'h2o.aguamala',
   'h2o.app',
   'h2o.profile'
   ]).
  controller('h2o', function($rootScope, $scope, $http, $location, auth){
    $scope.homeLink = document.getElementById('logoapp');
    $rootScope.menuList = document.getElementById('menu_list');
    $scope.load = document.getElementById('load');
    $scope.loadCont = document.getElementById('loadCont');
    $rootScope.heartbeats = 0;
    $scope.currentLink = $scope.homeLink;
    $rootScope.loading = function(){
      if ($rootScope.start) {
         $rootScope.start = false;
         $rootScope.menuList.style.display = 'none';
         $scope.homeLink.style.display = 'none';
         $scope.loadCont.style.display = 'block';
         }
      else {
         $rootScope.start = true;
         $rootScope.menuList.style.display = 'block';
         $scope.homeLink.style.display = 'block';
         $scope.loadCont.style.display = 'none';
         }
    };
    $scope.homeLink.addEventListener('click', function(){
      $scope.currentLink.className = '';
      });
    var $rota = $('#load'),
        degree = 0,
        timer;
    $scope.rotate = function() {
        $rota.css({ transform: 'rotate(' + degree + 'deg)'});
        // timeout increase degrees:
        timer = setTimeout(function() {
            ++degree;
            $scope.rotate(); // loop it
        },25);
    };
    $scope.rotate();    // run it!
    $('#logoapp').on('click', function(){
        $scope.$apply(function(){
          $location.path("/");
        });
      });
    $rootScope.loadMenu = function(){
      if ($rootScope.state === 'loading') {
        _.each($rootScope.menuItems, function(value){
             var li = document.createElement('li');
             var link = document.createElement('a');
             var ic = document.createElement('i');
             if (value.url === $location.path()) {
                li.className = 'active';
                $scope.currentLink = li;
                }
             link.innerHTML = ' '+value.name;
             li.dataset.url = value.url;
             ic.className = 'fa fa-'+value.icon;
             link.addEventListener('click', function(){
                   var links = this.parentNode.parentNode.childNodes;
                   for(var i=0; i<links.length; i++) {
                      if (links[i] !== this.parentNode)
                         links[i].className = '';
                      else {
                         links[i].className = 'active';
                         $scope.currentLink = this.parentNode;
                         }
                      }
                   $scope.$apply(function(){
                     $location.path(value.url);
                   });
                  }, false);
         link.insertBefore(ic, link.firstChild);
         li.appendChild(link);
         $rootScope.menuList.appendChild(li);
         });
       }
       else {
          var links = $rootScope.menuList.childNodes;
          for(var i=0; i<links.length; i++) {
             if (links[i].dataset.url!==$location.path())
                links[i].className = '';
             else
                links[i].className = 'active';
             }
          }
    };
    $rootScope.socket.onerror = function (wss) {
     console.log('err');
    };
    $rootScope.socket.onclose = function (wss) {
      $scope.loadCont.style.display = 'block';
      setTimeout(function(){
        window.location.href = '/';
      }, 2000);

    };
    $rootScope.socket.onopen = function (wss) {
      var log = {
        app: $rootScope.app,
        type: 'start'
        };
    $rootScope.socket.send(JSON.stringify(log));
      setInterval(function(){
      var log = {
        app: $rootScope.app,
        type: 'ping'
        };
      $rootScope.socket.send(JSON.stringify(log));
      },3000);
      };
    $rootScope.$on('$routeChangeStart', function(event, current, previous, rejection) {
      $rootScope.loadMenu();
      $rootScope.included = 'loading';
      });
    $rootScope.$on('$includeContentLoaded', function(event) {
      $rootScope.included = 'start';
      });
    $rootScope.socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
          if ((data)&&(data.type)){
            switch(data.type) {
               case 'start':
                      $rootScope.uname = data.uname;
                      $rootScope.menuItems = data.menu;
                      $rootScope.sid = data.sid;
                      var loggedInfo = document.getElementById('loggedInfo');
                      if ($rootScope.uname !== 'alien') {
                          loggedInfo.childNodes[0].innerHTML = $rootScope.uname+' <i class="fa fa-gear"></i>';
                          loggedInfo.childNodes[2].childNodes[3].childNodes[0].innerHTML = '<i class="fa fa-power-off"></i><small><b> Sign Out</b></small>';
                          loggedInfo.childNodes[2].childNodes[3].addEventListener('click', function(){
                          auth.logout();
                          });
                          loggedInfo.childNodes[2].childNodes[1].childNodes[0].innerHTML = '<i class="fa fa-user"></i><small> <b> Profile</b>'+'</small>';
                          loggedInfo.childNodes[2].childNodes[1].addEventListener('click', function(){
                             $scope.$apply(function(){
                               $location.path("/module/profile/section/main");
                             });
                          });
                         }
                      else {
                         //loggedInfo.style.display = 'none';
                          loggedInfo.childNodes[0].innerHTML = ' <i class="fa fa-user"></i>';
                          loggedInfo.childNodes[2].childNodes[1].childNodes[0].innerHTML = '<i class="fa fa-unlock-alt"></i><small> Sign<b> In</b>'+'</small>';
                          loggedInfo.childNodes[2].childNodes[1].addEventListener('click', function(){
                             $scope.$apply(function(){
                               $location.path("/signin");
                             });
                          });
                          loggedInfo.childNodes[2].childNodes[3].childNodes[0].innerHTML = '<i class="fa fa-hand-o-right"></i><small> Sign<b> Up</b>'+'</small>';
                          loggedInfo.childNodes[2].childNodes[3].addEventListener('click', function(){
                             $scope.$apply(function(){
                               $location.path("/signup");
                             });
                          });
                         }
                      $rootScope.loadMenu();
                      $rootScope.state = 'start';
               break;
               case 'pong':
                    $rootScope.heartbeats++;
               break;
               case 'sign_in_fail':
                     var panel = document.getElementById('signinPanelBody');
                     var div = document.createElement('div');
                     var btn = document.createElement('button');
                     var msg = document.createElement('p');
                     div.className = 'alert alert-danger alert-dismissable';
                     btn.type = 'button';
                     btn.className = 'close';
                     btn.dataset.dismiss = 'alert';
                     btn.innerHTML = '&times;';
                     msg.innerHTML = data.response.toString();
                     div.appendChild(btn);
                     div.appendChild(msg);
                     panel.insertBefore(div, panel.firstChild);
                     $scope.singin_pssw = document.getElementById('singin_pssw');
                     $scope.user_signin = document.getElementById('user_signin');
                     $scope.singin_pssw.value = '';
                     $scope.singin_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña';
                     $scope.singin_pssw.parentNode.className = 'form-group';
                     $scope.user_signin.disabled = true;
                     $rootScope.loading();
               break;
               case 'sign_in_ok':
                     if (data.sid === $rootScope.sid)
                        auth.login(data.response);
               break;
               case 'sign_out':
                     if (data.uname === $rootScope.uname)
                        auth.logout();
               break;
               case 'sign_up_fail':
                     var panel = document.getElementById('signupPanelBody');
                     var div = document.createElement('div');
                     var btn = document.createElement('button');
                     var msg = document.createElement('p');
                     div.className = 'alert alert-danger alert-dismissable';
                     btn.type = 'button';
                     btn.className = 'close';
                     btn.dataset.dismiss = 'alert';
                     btn.innerHTML = '&times;';
                     msg.innerHTML = data.response.detail;
                     div.appendChild(btn);
                     div.appendChild(msg);
                     panel.insertBefore(div, panel.firstChild);
                     $scope.singup_email = document.getElementById('singup_email');
                     $scope.singup_email.parentNode.childNodes[1].innerHTML = 'Email no valido';
                     $scope.singup_email.parentNode.className = 'form-group has-error';
                     $scope.singup_pssw = document.getElementById('singup_pssw');
                     $scope.user_signup = document.getElementById('user_signup');
                     $scope.singup_pssw.value = '';
                     $scope.singup_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña';
                     $scope.singup_pssw.parentNode.className = 'form-group';
                     $scope.user_signup.disabled = true;
                     $rootScope.loading();
               break;
               case 'sign_up_ok':
                  if (data.sid === $rootScope.sid)
                    auth.login(data.response);
               break;
               case 'join':
                 if (data.sid === $rootScope.sid)
                      window.location.href = "/meat/"+data.room;
               break;
               case 'profile_fail':
                  console.log(data.response);
               break;
               case 'profile_data':
                  //console.log(data.response);
                  $scope.pemail = document.getElementById('pemail');
                  $scope.pname = document.getElementById('pname');
                  $scope.plastname = document.getElementById('plastname');
                  $scope.uname = document.getElementById('uname');
                  $scope.dbirth = document.getElementById('dbirth');
                  $scope.pic = document.getElementById('pic');
                  $scope.pemail.value = data.response.email;
                  $scope.pname.value = data.response.pname;
                  $scope.plastname.value = data.response.plastname;
                  $scope.uname.innerHTML = data.response.uname;
                  $scope.dbirth.value = data.response.dbirth;
                  $scope.pic.src = data.response.pic;
                  $rootScope.start = false;
                  $rootScope.loading();
                  $('.panel').css({ transform: 'rotate(0deg)'});
               break;
               }
              }
          };
    });