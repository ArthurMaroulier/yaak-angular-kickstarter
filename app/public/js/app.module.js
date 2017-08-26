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
    .config(function (logExProvider) {
        // Log-ex config
        logExProvider.enableLogging(true);
        logExProvider.overrideLogPrefix(function (className) {
            var $injector = angular.injector(['ng']),
                $filter = $injector.get('$filter'),
                separator = " >> ",
                format = "HH:mm:ss",
                now = $filter('date')(new Date(), format);
            return "" + now + (!angular.isString(className) ? "" : "::" + className) + separator;
        });
    })

    .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {

        // App routes
        $stateProvider
            .state({
                name: 'home',
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'homeController'
            })
            .state({
                name: 'dummy',
                url: '/dummy',
                templateUrl: 'dummy/dummy.html',
                controller: 'dummyController'
            });

            $urlRouterProvider.otherwise('/');


        // Use the HTML5 History API
        $locationProvider.html5Mode(true);
    })

    .config(function ($compileProvider) {
        // Enabling or disabling Debug Data
        // make this false in production to make the app faster
        $compileProvider.debugInfoEnabled(true);
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpLoggerInterceptor');
    });

