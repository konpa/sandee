/*
|--------------------------------------------------------------------------
| Sandee Angular App Controllers
|--------------------------------------------------------------------------
|
*/

angular.module('myApp.controllers', []).


    /*
    |--------------------------------------------------------------------------
    | Global controller (for all views)
    |--------------------------------------------------------------------------
    |
    */
    controller('GlobalCtrl', function ($scope, $http) {

        'use strict';

        // No content
    })


    /*
    |--------------------------------------------------------------------------
    | Index view controller
    |--------------------------------------------------------------------------
    |
    */
    .controller('IndexController', function($scope, $http) {

        'use strict';


        /**
        * Get gulp running process list from API
        * ------
        * Initialize variable with all running gulp process from node
        * session in order keep view up to date.
        */
        var gulpProcesses;

        $http
            .get('/api/gulp/session')
            .success(function (data, status, headers, config) {
                gulpProcesses = data;
            })
            .error(function (data, status, headers, config) {
                console.log('Error getting session');
            });


        /**
        * Detect if sandbox is running
        *
        * @params name
        * @return pid
        */
        $scope.isLaunched = function(name) {

            if (typeof gulpProcesses !== 'undefined' && gulpProcesses.indexOf(name + ':') > -1) // Check if sandbox name is in session
            {
                // Get first cursor position of corresponding pid
                var pidStart = gulpProcesses.indexOf(name) + name.length + 1;

                // Get last cursor position of corresponding pid
                var pidStop = gulpProcesses.indexOf(";", pidStart);

                // Slice and return pid
                return gulpProcesses.slice(pidStart, pidStop);
            }

            return false;
        };


        /**
        * Get all sandboxes from API
        */
        $http
            .get('/api/sandboxes')
            .success(function (data, status, headers, config) {
                $scope.sandboxes = data;
            })
            .error(function (data, status, headers, config) {
                console.log('Error getting sandboxes');
            });


        /**
        * Send Start/Stop gulp order to API
        *
        * @params sandbox
        */
        $scope.gulp = function(sandbox) {

            // Check if sandbox is running
            var pid = $scope.isLaunched(sandbox.name); // contains pid if yes, false if not

            // Store API path depending on pid value
            var path = (pid) ? ('api/gulp/' + sandbox.name + '/stop/' + pid) : ('api/gulp/' + sandbox.name + '/start');

            // Send http request to API
            $http
                .get(path)
                .success(function (data, status, headers, config) {

                    // Update session
                    gulpProcesses = data;
                })
                .error(function (data, status, headers, config) {
                    console.log('Error launching/stopping sandbox');
                });
        };


        /**
        * Send "Launch editor" action to API
        *
        * @params sandbox
        */
        $scope.launchEditor = function(sandbox) {

            // Store API path depending on pid value
            var path = 'api/editor/' + sandbox.name;

            // Send http request to API
            $http
                .get(path)
                .success(function (data, status, headers, config) {
                    console.log('Editor launched');
                })
                .error(function (data, status, headers, config) {
                    console.log('Error launching editor');
                });
        };
    })


    /*
    |--------------------------------------------------------------------------
    | Add controller
    |--------------------------------------------------------------------------
    |
    */
    .controller('AddController', function ($scope, $http, $location) {

        'use strict';


        /**
        * Send Start/Stop gulp order to API
        *
        * @params sandbox
        */
        $scope.addSandbox = function(name) {

            if (typeof name == 'undefined' || name === '') { return false; }

            // Store API path
            var path = 'api/sandboxes/add/' + name;

            // Send http request to API
            $http
                .get(path)
                .success(function (data, status, headers, config) {
                    $location.path('/');
                })
                .error(function (data, status, headers, config) {
                    console.log('Error sending request to API');
                });
        };
    })

    /*
    |--------------------------------------------------------------------------
    | Sandbox controller
    |--------------------------------------------------------------------------
    |
    */
    .controller('SandboxController', function ($scope, $http, $routeParams, $location) {

        'use strict';

        var name = $routeParams.name;

        /**
        * Get sandbox from API
        */
        $http
            .get('/api/sandboxes/' + name)
            .success(function (data, status, headers, config) {
                $scope.sandbox = data;
            })
            .error(function (data, status, headers, config) {
                console.log('Error getting sandbox');
            });

        /**
        * Send delete sandbox order to API
        *
        * @params id, name
        */
        $scope.deleteSandbox = function(sandbox) {

            $http
                .get('/api/sandboxes/delete/' + sandbox.name)
                .success(function (data, status, headers, config) {
                    $location.path('/');
                })
                .error(function (data, status, headers, config) {
                    console.log('Error deleting sandbox');
                });
        }
    });
