'use strict';

angular.module('mygov.auth', ['ionic', 'ngCordova'])

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

  /********************** AuthCtrl (login, register, logout, handleErrors) *********************/
  .controller('AuthCtrl', function($scope, $state, AuthFactory, $cordovaDialogs) {
    $scope.register = register;
    $scope.login = login;

    /********************** login action *********************/
    function login(identifier, password) {
      /********************** check if all fields were provided *********************/
      var all_fields_exists = fields_exist(arguments);

      /********************** Call AuthFactory if allfields provided *********************/
      if (all_fields_exists) {
        AuthFactory.login(identifier, password).then(function success(response){
          $state.go('tabs.activities');
        }, handleError)
      }
      else {
        empty_fields();
      }
    };

    /********************** register action *********************/
    function register(first_name, last_name, username, email, password) {
      /********************** check if all fields were provided *********************/
      var all_fields_exists = fields_exist(arguments);

      /********************** Call AuthFactory if allfields provided *********************/
      if (all_fields_exists) {
        AuthFactory.register(first_name, last_name, username, email, password).then(function success(response){
          $state.go('tabs.activities');
        }, handleError)
      }
      else {
        empty_fields();
      }
    };

    function empty_fields() {
      if (window.CordovaDialogs) {
        $cordovaDialogs.alert('All fields are required');
      }
      else {
        alert('All fields are required');
      }
    }

    /********************** check if all fields are provided function, else throgh error *********************/
    function fields_exist() {
      var all_exist = true;
      var args = Array.prototype.slice.call(arguments[0]);
      args.forEach(function(entry) {
        if (typeof(entry) == 'undefined' || entry.length == 0) {
          all_exist = false;
        }
      });
      return all_exist;
    }

    /********************** handle error function if api call fail or error happens *********************/
    function handleError(response) {
      if (window.CordovaDialogs) {
        console.log('Error: ' + response.data.error);
        $cordovaDialogs.alert('Error: ' + response.data.error);
      }
      else {
        console.log('Error: ' + response.data.error);
        alert('Error: ' + response.data.error);
      }
    };
  })

  /********************** API constant url *********************/
  .constant('API', 'http://localhost:1337')

  /********************** AuthFactory (login, register, logout) *********************/
  .factory('AuthFactory', function AuthFactory($http, API, AuthTokenFactory){
    return {
      login: login,
      register: register
    };

    /********************** login function *********************/
    function login(identifier, password){
      return $http.post(API + '/auth/local', {
        identifier: identifier,
        password: password
      }).then(function success(response){
        AuthTokenFactory.setToken(response.data.token);
        AuthTokenFactory.setUser(response.data.user);
        return response;
      })
    };

    /********************** register function *********************/
    function register(first_name, last_name, username, email, password){
      return $http.post(API + '/auth/local/register', {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: password
      }).then(function success(response){
        AuthTokenFactory.setToken(response.data.token);
        AuthTokenFactory.setUser(response.data.user);
        return response;
      })
    };
  })

  /********************** AuthTokenFactory (setToken, getToken) *********************/
  .factory('AuthTokenFactory', function AuthTokenFactory($window){
    /********* get the localStorage ***************/
    var store = $window.localStorage;
    /********* define access_token_key var ***************/
    var access_token_key = 'access_token';
    var user_key = 'current_user';
    return {
      setToken: setToken,
      getToken: getToken,
      setUser: setUser,
      loggedIn: loggedIn
    };

    /********************** setToken function *********************/
    function setToken(token){
      // if token is provided set  the access_token_key else remove it
      if (token) {
        store.setItem(access_token_key, token);
      }
      else {
        store.removeItem(access_token_key);
      }
    };

    /********************** getToken function *********************/
    function getToken(){
      return store.getItem(access_token_key);
    };

    /********************** setUser function *********************/
    function setUser(user) {
       if (user) {
         store.setItem(user_key, user);
       }
       else {
         store.removeItem(user_key);
       }
    };

    /********************** setUser function *********************/
    function loggedIn() {
       return store.getItem(user_key) != null
    }
  })

  /********************** AuthInterceptor (setToken, getToken) *********************/
  .factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory){

    return {
      request: addToken
    };

    /********************** addToken function *********************/
    function addToken(config){
      var token = AuthTokenFactory.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    };
  })