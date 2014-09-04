/*
|--------------------------------------------------------------------------
| Sandee Angular App Directives
|--------------------------------------------------------------------------
|
*/

angular.module('myApp.directives', []).

    directive('isLaunched', function ($animate) {

        'use strict';


        return function(scope, elm, attrs) {

            scope.$watch(attrs.isLaunched, function (newVal) {

                if (newVal) {
                    $animate.addClass(elm, "fa-spin");
                } else {
                    $animate.removeClass(elm, "fa-spin");
                }
            });
        };
    })


    .directive('isLaunchedBtn', function ($animate) {

        'use strict';


        return function(scope, elm, attrs) {

            scope.$watch(attrs.isLaunchedBtn, function (newVal) {

                if (newVal) {
                    $animate.removeClass(elm, "fa-play");
                    $animate.addClass(elm, "fa-stop");
                } else {
                    $animate.removeClass(elm, "fa-stop");
                    $animate.addClass(elm, "fa-play");
                }
            });
        };
    });
