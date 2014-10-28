'use strict';

angular.module('mygov.auth', ['auth.services', 'auth.controllers'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');

  $stateProvider
    .state('auth', {
      url: "/auth",
      templateUrl: "auth/auth.html"
    })

    .state('login', {
      url: "/login",
      templateUrl: "auth/login.html",
      controller: 'AuthCtrl'
    })

    .state('register', {
      url: "/register",
      templateUrl: "auth/register.html",
      controller: 'AuthCtrl'
    })
  }
)