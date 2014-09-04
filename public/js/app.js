/*
|--------------------------------------------------------------------------
| Sandee Angular App configuration
|--------------------------------------------------------------------------
|
*/

angular.module('sandee', [
    'ngRoute',
    'ngAnimate',

    'myApp.controllers',
    'myApp.filters',
    'myApp.services',
    'myApp.directives'
]).

    config(function ($routeProvider, $locationProvider) {

        'use strict';


        /**
        * Routes
        */

        $routeProvider.
        when('/', {
            templateUrl: 'partials/index',
            controller: 'IndexController'
        }).
        when('/add', {
            templateUrl: 'partials/add',
            controller: 'AddController'
        }).
        when('/sandboxes/:name', {
            templateUrl: 'partials/sandbox',
            controller: 'SandboxController'
        }).
        otherwise({
            redirectTo: '/'
        });

        // Remove # in url
        $locationProvider.html5Mode(true);
    });
