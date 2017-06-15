(function () {
    "use strict";

    var geolocatorService = function ($window, $q, $log) {

        var currentPositionDefer = $q.defer();
        var watchPositionDefer = $q.defer();

        var options = {
            enableHighAccuracy: true
        };

        var browserSupportsGeolocation = function () {
            return "geolocation" in $window.navigator;
        };

        var handleGetCurrentPositionError = function (error) {
            $log.error(error);
        };

        var handleGetCurrentPositionResponse = function (data) {
            currentPositionDefer.resolve(data);
        };

        var handleWatchPositionResponse = function (response) {
            watchPositionDefer.resolve(response);
        };

        var handleWatchPositionError = function (error) {
            watchPositionDefer.error(error);
        };

        var currentPosition = function () {

            if (browserSupportsGeolocation()) {
                $window.navigator.geolocation.getCurrentPosition(handleGetCurrentPositionResponse, handleGetCurrentPositionError, options);
            } else {
                $log.error("goalocation not supported");
            }

            return currentPositionDefer.promise;
        };

        var watchPosition = function () {

            if (browserSupportsGeolocation()) {
                var id = $window.navigator.geolocation.watchPosition(handleWatchPositionResponse, handleWatchPositionError, options);
                $log.info(id);
            } else {
                $log.error(" goalocation not supported");
            }

            return watchPositionDefer.promise;
        };

        var clearWatch = function (id) {
            if (browserSupportsGeolocation()) {
                $window.navigator.geolocation.clearWatch(id);
            } else {
                $log.error(" goalocation not supported");
            }
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
