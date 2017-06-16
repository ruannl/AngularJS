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
            return "geolocation" in $window.navigator;
        };

        var handleGetCurrentPositionError = function (error) {
            currentPositionDefer.reject(error);
        };

        var handleGetCurrentPositionResponse = function (data) {
            currentPositionDefer.resolve({
                accuracy: data.coords.accuracy,
                latitude: data.coords.latitude,
                longitude: data.coords.longitude
            });
        };

        var handleWatchPositionResponse = function (response) {
            watchPositionDefer.resolve(response);
        };

        var handleWatchPositionError = function (error) {
            watchPositionDefer.reject(error);
        };

        var getCurrentPosition = function () {

            if (browserSupportsGeolocation()) {
                $window.navigator.geolocation.getCurrentPosition(handleGetCurrentPositionResponse, handleGetCurrentPositionError, options);
            } else {
                currentPositionDefer.reject("geolocation not supported");
                $log.error("geolocation not supported");
            }

            return currentPositionDefer.promise;
        };

        var watchPosition = function () {

            if (browserSupportsGeolocation()) {
                watchPositionId = $window.navigator.geolocation.watchPosition(handleWatchPositionResponse, handleWatchPositionError, options);
                $log.info({ watchPositionId: watchPositionId });
            }

            return watchPositionDefer.promise;
        };

        var clearWatch = function (watchPositionId) {
            $window.navigator.geolocation.clearWatch(watchPositionId);
        };

        return {
            getCurrentPosition: getCurrentPosition,
            watchPosition: watchPosition,
            clearWatch: clearWatch
        };
    };

    angular.module("rlsGeolocator", [])
        .factory("rlsGeolocatorService", ["$window", "$q", "$log", geolocatorService]);

})();
