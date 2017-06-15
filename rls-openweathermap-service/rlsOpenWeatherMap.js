(function () {
    "use strict";

    var settings = {

    };

    var openWeatherMapService = function ($http, $q, $filter) {

        var currentWeatherDefer = $q.defer();
        var weatherForecastDefer = $q.defer();

        function OpenWeatherMap() {
            apiKey = settings.apiKey;
        }

        var handleCurrentWeatherResponse = function (response) {
            var data = response.data;
            var responseObject = {
                date: new Date(1000 * data.dt).toLocaleDateString(),
                city: data.name,
                coord: data.coord,
                clouds: data.clouds.all,
                description: data.weather[0].main,
                icon: data.weather[0].icon,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                temp: {
                    now: $filter("number")(data.main.temp, 0),
                    min: $filter("number")(data.main.temp_min, 0),
                    max: $filter("number")(data.main.temp_max, 0)
                },
                sunrise: $filter("date")(new Date(1000 * data.sys.sunrise), "HH:mm"),
                sunset: $filter("date")(new Date(1000 * data.sys.sunset), "HH:mm"),
                visibility: data.visibility,
                wind: { degrees: data.wind.deg, speed: data.wind.speed }
            };

            currentWeatherDefer.resolve(responseObject);
        };

        var handleCurrentWeatherError = function (error) {
            currentWeatherDefer.error(error)
        };

        var handleWeatherForecastResponse = function (response) {
            var data = response.data;
            var list = data.list;
            var items = [];

            angular.forEach(list, function (item) {
                items.push(
                    {
                        date: $filter("date")(new Date(item.dt_txt), "yyyy-MM-dd"),
                        time: $filter("date")(new Date(item.dt_txt), "HH:mm"),
                        clouds: item.clouds.all + " %",
                        description: item.weather[0].description,
                        icon: item.weather[0].icon,
                        humidity: item.main.humidity + " %",
                        pressure: item.main.pressure + " hPa",
                        temp: {
                            now: $filter("number")(item.main.temp, 0),
                            min: $filter("number")(item.main.temp_min, 0),
                            max: $filter("number")(item.main.temp_max, 0),
                        },
                        wind: {
                            degrees: item.wind.deg + "degrees",
                            speed: item.wind.speed + " meter/sec"
                        }
                    }
                );
            });

            var responseObject = {
                city: data.city.name,
                items: items
            };

            weatherForecastDefer.resolve(responseObject);
        };

        var handleWeatherForecastError = function (error) {
            weatherForecastDefer.error(error);
        };

        OpenWeatherMap.prototype.getCurrentWeather = function (lat, long) {

            $http({
                url: settings.weatherUrl,
                method: "GET",
                params: {
                    APPID: settings.apiKey,
                    lat: lat,
                    lon: long,
                    units: "metric"
                }
            }).then(handleCurrentWeatherResponse, handleCurrentWeatherError);

            return currentWeatherDefer.promise;
        };

        OpenWeatherMap.prototype.getWeatherForecast = function (lat, long) {

            $http({
                url: settings.forecastUrl,
                method: "GET",
                params: {
                    APPID: settings.apiKey,
                    lat: lat,
                    lon: long,
                    units: "metric"
                }
            }).then(handleWeatherForecastResponse, handleWeatherForecastError);

            return weatherForecastDefer.promise;
        };

        return new OpenWeatherMap(); // Singleton
    };

    var openWeatherMapProvider = function () {

        settings.apiKey = null;
        setApiKey = function (key) {
            settings.apiKey = key;
        };
        getApiKey = function () {
            return settings.apiKey;
        };

        settings.apiVersion = "2.5";
        setApiVersion = function (key) {
            settings.apiVersion = key;
        };

        getApiVersion = function () {
            return settings.apiVersion;
        };

        init = function () {
            settings.weatherUrl = `http://api.openweathermap.org/data/${settings.apiVersion}/weather`;
            settings.forecastUrl = `http://api.openweathermap.org/data/${settings.apiVersion}/forecast`;
        }

        $get = ["$http", "$q", "$filter", openWeatherMapService];

    }

    angular.module("rlsOpenWeatherMap", [])
        .value("settings", settings)
        .provider("rlsOpenWeatherMap", [openWeatherMapProvider]);
})();
