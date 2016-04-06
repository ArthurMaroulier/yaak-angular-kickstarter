'use strict';
// This method allow you to split your modules into multiple files easlily.
// angular.module() improvement.
//
(function (angular) {

    var origMethod = angular.module;
    var alreadyRegistered = {};

    angular.module = function (name, reqs, configFn) {
        reqs = reqs || [];
        var module = null;

        if (alreadyRegistered[name]) {
            module = origMethod(name);
            module.requires.push.apply(module.requires, reqs);
        } else {
            module = origMethod(name, reqs, configFn);
            alreadyRegistered[name] = ' ';
        }
        return module;
    };

})(angular);

// Application module
var app = angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'log.ex.uo',
    'picardy.fontawesome',
    'ui.bootstrap'
]);

app.config(['$routeProvider', '$locationProvider', '$compileProvider', 'logExProvider', function ($routeProvider, $locationProvider, $compileProvider, logExProvider) {

    // App routes
    $routeProvider
    .when('/test', {
        templateUrl: './partials/partial.html',
        controller: 'TestCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

    // Use the HTML5 History API
    $locationProvider.html5Mode(true);

    // Enabling or disabling Debug Data
    // make this false in production to make the app faster
    $compileProvider.debugInfoEnabled(true);

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
}]);

// Application controller
app.controller('appController', ['$scope', '$log', function appController ($scope, $log) {
    $scope.title = 'YAAK - Angular kickstarter';
    $scope.subtitle = '(yet another)';
    $scope.components = [
        'angularJS',
        'angular-bootstrap',
        'angular-fontawesome',
        'bootstrap',
        '...'
    ];

    // Log-ex tests
    // Init log-ex prefix
    $log = $log.getInstance('appController');

    $log.log("Check These cool logs (log)");
    $log.warn("Check These cool logs (warn)");
    $log.info("Check These cool logs (info)");
    $log.error("Check These cool logs (error)");
    $log.debug("Check These cool logs (debug)");
}]);
