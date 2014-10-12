'use strict';

angular.module('enterprise.auth', ['ionic', 'ngCordova'])

  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider
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
  .controller('AuthCtrl', ['$scope', 'AuthFactory', function($scope, AuthFactory, $cordovaDialogs, $state) {
    $scope.register = register;
    $scope.login = login;

    /********************** login action *********************/
    function login(email, password) {
      /********************** check if all fields were provided *********************/
      var all_fields_exists = fields_exist(arguments);

      /********************** Call AuthFactory if allfields provided *********************/
      if (all_fields_exists) {
        AuthFactory.login(email, password).then(function success(response){
          console.log(response.data);
          $state.go('tabs.activities');
        }, handleError)
      }
      else {
        empty_fields();
      }
    };

    /********************** register action *********************/
    function register(first_name, last_name, email, password) {
      /********************** check if all fields were provided *********************/
      var all_fields_exists = fields_exist(arguments);

      /********************** Call AuthFactory if allfields provided *********************/
      if (all_fields_exists) {
        AuthFactory.register(first_name, last_name, email, password).then(function success(response){
          console.log(response.data);
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
  }])

  /********************** API constant url *********************/
  .constant('API', 'http://localhost:1337')

  /********************** AuthFactory (login, register, logout) *********************/
  .factory('AuthFactory', ['$http', 'API', 'AuthTokenFactory', function AuthFactory($http, API, AuthTokenFactory){
    return {
      login: login,
      register: register
    };

    /********************** login function *********************/
    function login(email, password){
      return $http.post(API + '/auths/login', {
        email: email,
        password: password
      }, {withCredentials: true}).then(function success(response){
        AuthTokenFactory.setToken(response.data.token);
        return response;
      })
    };

    /********************** register function *********************/
    function register(first_name, last_name, email, password){
      return $http.post(API + '/users/create', {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
      }, {withCredentials: true}).then(function success(response){
        AuthTokenFactory.setToken(response.data.token);
        return response;
      })
    };
  }])

  /********************** AuthTokenFactory (setToken, getToken) *********************/
  .factory('AuthTokenFactory', ['$window', function AuthTokenFactory($window){
    /********* get the localStorage ***************/
    var store = $window.localStorage;
    /********* define access_token key var ***************/
    var key = 'access_token';
    return {
      setToken: setToken,
      getToken: getToken
    };

    /********************** setToken function *********************/
    function setToken(token){
      // if token is provided set  the key else remove it
      if (token) {
        store.setItem(key, token);
      }
      else {
        store.removeItem(key);
      }
    };

    /********************** getToken function *********************/
    function getToken(){
      return store.getItem(key);
    };
  }])

  /********************** AuthInterceptor (setToken, getToken) *********************/
  .factory('AuthInterceptor', ['AuthTokenFactory', function AuthInterceptor(AuthTokenFactory){

    return {
      request: addToken
    };

    /********************** addToken function *********************/
    function addToken(config){
      var token = AuthTokenFactory.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.access_token = token;
      }
      return config;
    };
  }])