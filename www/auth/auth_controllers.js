angular.module('auth.controllers', ['ngCordova'])


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
            AuthFactory.login(identifier, password).then(function success(){
                $state.go('tabs.activities');
            }, handleError)
        }
        else {
            empty_fields();
        }
    }

    /********************** register action *********************/
    function register(first_name, last_name, username, email, password) {
        /********************** check if all fields were provided *********************/
        var all_fields_exists = fields_exist(arguments);

        /********************** Call AuthFactory if allfields provided *********************/
        if (all_fields_exists) {
            AuthFactory.register(first_name, last_name, username, email, password).then(function success(){
                $state.go('tabs.activities');
            }, handleError)
        }
        else {
            empty_fields();
        }
    }
        function empty_fields() {
        if (window.cordova) {
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
    function handleError() {
        //if (window.CordovaDialogs) {
        //  console.log('Error: ' + response.data.error);
        //  $cordovaDialogs.alert('Error: ' + response.data.error);
        //}
        //else {
        //  console.log('Error: ' + response.data.error);
        //  alert('Error: ' + response.data.error);
        //}
        $state.go('tabs.activities');
    }
});