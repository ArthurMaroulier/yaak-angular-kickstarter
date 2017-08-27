'use strict';

angular.module('home')
    .controller('homeController', ['$scope', '$log', function appController ($scope, $log) {

        $scope.title = 'YAAK - Angular kickstarter';
        $scope.subtitle = '(yet another)';
        $scope.components = [
            'angularJS ' + angular.version.full,
            'font awesome',
            'bootstrap',
            '...'
        ];

        // Log-ex tests
        // Init log-ex prefix
        $log = $log.getInstance('homeController');

        $log.log("Check These cool logs (log)");
        $log.warn("Check These cool logs (warn)");
        $log.info("Check These cool logs (info)");
        $log.error("Check These cool logs (error)");
        $log.debug("Check These cool logs (debug)");
    }]);