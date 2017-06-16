(function () {
    "use strict";

    var geolocatorService = function ($window, $q, $log) {

        var currentPositionDefer = $q.defer();
        var watchPositionDefer = $q.defer();
        var watchPositionId = 0;

        var options = {
            enableHighAccuracy: true
        };

        var browserSupportsGeolocation = function () {
            return $window.navigator.hasOwnProperty("geolocation");
        };

        var handleGetCurrentPositionError = function (error) {
            currentPositionDefer.reject(error);
        };

        var handleGetCurrentPositionResponse = function (data) {
            currentPositionDefer.resolve(data);
        };

        var handleWatchPositionResponse = function (response) {
            watchPositionDefer.resolve(response);
        };

        var handleWatchPositionError = function (error) {
            watchPositionDefer.reject(error);
        };

        var currentPosition = function () {

            if (browserSupportsGeolocation()) {
                $window.navigator.geolocation.getCurrentPosition(handleGetCurrentPositionResponse, handleGetCurrentPositionError, options);
            } else {
                currentPositionDefer.reject("goalocation not supported");
                $log.error("goalocation not supported");
            }

            return currentPositionDefer.promise;
        };

        var watchPosition = function () {

            if (browserSupportsGeolocation()) {
                watchPositionId = $window.navigator.geolocation.watchPosition(handleWatchPositionResponse, handleWatchPositionError, options);
                $log.info({watchPositionId: watchPositionId});
            }

            return watchPositionDefer.promise;
        };

        var clearWatch = function (watchPositionId) {
            $window.navigator.geolocation.clearWatch(watchPositionId);
        };

        return {
            currentPosition: currentPosition,
            watchPosition: watchPosition,
            clearWatch: clearWatch
        };
    };

    angular.module("rlsGeolocator", [])
           .factory("rlsGeolocatorService", ["$window", "$q", "$log", geolocatorService]);

})();
