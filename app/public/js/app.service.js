'use strict';

// Application module
angular.module('app')
    .factory('httpLoggerInterceptor', function ($log, $q) {
        $log = $log.getInstance('httpLoggerInterceptor');

        return {
            request: function (config) {
                //weed out loading of views - we just want service requests.
                if (config.url.indexOf('html') == -1) {
                    $log.info("HTTP >>> " + config.method + " " + config.url, config.data || {});
                }
                return config;
            },

            response: function (response) {
                if (response.config.url.indexOf('html') == -1) {

                    $log.info("HTTP <<< " + response.config.method + " " + response.config.url + " (" + response.status + ") ", response.data);
                }

                return response || $q.when(response);
            },

            responseError: function (rejection) {
                $log.error("HTTP <<< " + rejection.config.method + " " + rejection.config.url + " (" + rejection.status + ") ");

                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

