angular.module('auth.services', [])
    
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