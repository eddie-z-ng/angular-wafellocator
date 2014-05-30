'use strict';

angular
  .module('waffellocatorApp', [
    'ngResource',
    'ngRoute',
    'waffellocatorApp.factories',
    'google-maps',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


angular
  // .module('waffellocatorApp.factories', ['angularLocalStorage']);
  .module('waffellocatorApp.factories', ['angularLocalStorage']);