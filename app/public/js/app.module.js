'use strict';

// Application module
angular.module('app', [
    'ui.router',
    'ngAnimate',
    'log.ex.uo',
    'ngMessages',
    'angular-loading-bar',

    'home',
    'dummy'
])
    .config(function (logExProvider, DEBUG) {
        // Log-ex config
        logExProvider.enableLogging(DEBUG);
        logExProvider.overrideLogPrefix(function (className) {
            var $injector = angular.injector(['ng']),
                $filter = $injector.get('$filter'),
                separator = " >> ",
                format = "HH:mm:ss",
                now = $filter('date')(new Date(), format);
            return "" + now + (!angular.isString(className) ? "" : "::" + className) + separator;
        });
    })

    .config(function ($compileProvider, DEBUG) {
        // Enabling or disabling Debug Data
        // make this false in production to make the app faster
        $compileProvider.debugInfoEnabled(DEBUG);
    })

    .config(function ($httpProvider, DEBUG) {
        if (DEBUG) {
            $httpProvider.interceptors.push('httpLoggerInterceptor');
        }
    });

